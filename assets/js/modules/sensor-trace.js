/**
 * Portfolio.sensorTrace — plays back the fabric-wetness project's sensor log.
 *
 * Markup (see the Fabric Wetness card in index.html):
 *   <div class="trace" data-sensor-trace data-start="139"
 *        data-readings="73.5,31,d 80.9,30.8,w …">
 *     <div class="trace__screen"> <svg class="trace__plot"></svg> … </div>
 *     <p class="trace__readout"> [data-trace-index] [data-trace-humidity]
 *        [data-trace-temperature] [data-trace-state] </p>
 *   </div>
 * Each reading is "humidity %, temperature °C, d (dry) | w (wet)", in the
 * order the rig logged them (humidity_temp_dataset.csv in the repository).
 *
 * Draws the humidity line, wet stretches in the "wet" colour, then sweeps a
 * cursor along it and shows each reading as it passes. Hovering scrubs to the
 * pointer. Playback runs through Portfolio.ambient (reduced motion, pause,
 * off-screen); without it the cursor rests on reading `data-start`.
 *
 * Depends on: Portfolio.ambient
 */
(function (Portfolio) {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const READINGS_PER_SECOND = 12;
  const HUMIDITY_AXIS = { min: 58, max: 96 };  // % RH at the bottom and top of the plot

  function parseReadings(text) {
    return text.trim().split(/\s+/).map((token) => {
      const [humidity, temperature, state] = token.split(',');
      return { humidity: Number(humidity), temperature: Number(temperature), wet: state === 'w' };
    });
  }

  /** Plot y (0 = top, 100 = bottom) for a humidity value. */
  const toY = (humidity) =>
    ((HUMIDITY_AXIS.max - humidity) / (HUMIDITY_AXIS.max - HUMIDITY_AXIS.min)) * 100;

  /** Consecutive readings in the same state, as [first, last] index pairs. */
  function runsOf(readings) {
    const runs = [];
    let start = 0;
    for (let i = 1; i <= readings.length; i += 1) {
      if (i === readings.length || readings[i].wet !== readings[start].wet) {
        runs.push([start, i - 1]);
        start = i;
      }
    }
    return runs;
  }

  function svgElement(name, attributes) {
    const element = document.createElementNS(SVG_NS, name);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
    return element;
  }

  /** One area + line per run; each run reaches the next one's first point, so the line never breaks. */
  function draw(svg, readings) {
    const lastIndex = readings.length - 1;
    svg.setAttribute('viewBox', `0 0 ${lastIndex} 100`);
    svg.setAttribute('preserveAspectRatio', 'none');

    for (const [first, last] of runsOf(readings)) {
      const end = Math.min(last + 1, lastIndex);
      const points = [];
      for (let i = first; i <= end; i += 1) points.push(`${i},${toY(readings[i].humidity).toFixed(2)}`);

      const wet = readings[first].wet;
      svg.append(
        svgElement('path', {
          class: wet ? 'trace__area trace__area--wet' : 'trace__area',
          d: `M${first},100L${points.join('L')}L${end},100Z`,
        }),
        svgElement('polyline', {
          class: wet ? 'trace__line trace__line--wet' : 'trace__line',
          points: points.join(' '),
        }),
      );
    }
  }

  function init(trace) {
    const readings = trace ? parseReadings(trace.dataset.readings || '') : [];
    const svg = trace && trace.querySelector('.trace__plot');
    if (readings.length < 2 || !svg) return;

    const field = (name) => trace.querySelector(`[data-trace-${name}]`);
    const fields = {
      index: field('index'),
      humidity: field('humidity'),
      temperature: field('temperature'),
      state: field('state'),
    };

    const lastIndex = readings.length - 1;
    let position = Math.min(Number(trace.dataset.start) || 0, lastIndex);  // fractional reading index
    let shown = -1;
    let scrubbing = false;

    const showReading = (index) => {
      const reading = readings[index];
      const state = reading.wet ? 'wet' : 'dry';
      trace.dataset.state = state;
      if (fields.index) fields.index.textContent = `#${String(index + 1).padStart(3, '0')}`;
      if (fields.humidity) fields.humidity.textContent = `${reading.humidity.toFixed(1)}%`;
      if (fields.temperature) fields.temperature.textContent = `${reading.temperature.toFixed(1)} °C`;
      if (fields.state) fields.state.textContent = state === 'wet' ? 'Wet' : 'Dry';
    };

    const render = () => {
      const index = Math.floor(position);
      const next = readings[Math.min(index + 1, lastIndex)];
      const humidity = readings[index].humidity + (next.humidity - readings[index].humidity) * (position - index);

      trace.style.setProperty('--x', `${(position / lastIndex) * 100}%`);
      trace.style.setProperty('--y', `${toY(humidity)}%`);

      const nearest = Math.round(position);
      if (nearest !== shown) {
        shown = nearest;
        showReading(nearest);
      }
    };

    draw(svg, readings);
    render();
    trace.classList.add('is-ready');

    Portfolio.ambient.run(trace, (deltaMs) => {
      if (scrubbing) return;
      position += (deltaMs / 1000) * READINGS_PER_SECOND;
      if (position > lastIndex) position = 0;  // back to the first reading
      render();
    });

    trace.addEventListener('pointermove', (event) => {
      const box = svg.getBoundingClientRect();
      if (!box.width) return;
      const ratio = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
      position = ratio * lastIndex;
      scrubbing = true;
      render();
    });

    trace.addEventListener('pointerleave', () => {
      scrubbing = false;
    });
  }

  Portfolio.sensorTrace = { init };
})(window.Portfolio = window.Portfolio || {});
