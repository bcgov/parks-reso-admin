import { Chart } from 'chart.js';

/**
 * Highlights the background behind datasets on hover.
 */
const barHighlightColumn = {
  id: 'barHighlightColumn',
  defaults: {
    color: '#eeeeee',
  },
  beforeDatasetsDraw(chart, args, options) {
    const {
      ctx,
      tooltip,
      chartArea: { top, bottom, left, right, width, height },
      scales: { x, y },
    } = chart;

    if (tooltip._active[0]) {
      const index = tooltip._active[0].index;

      let newWidth =
        x._gridLineItems[index + 1].x1 - x._gridLineItems[index].x1;

      ctx.fillStyle = options.color;
      ctx.fillRect(x._gridLineItems[index].x1, top, newWidth, height);
    }
  },
};

export class ChartPlugins {
  // List non-global plugins here. These plugins have to be manually added to each chart that uses them.
  public readonly barHighlightColumnPlugin = barHighlightColumn;
}

export function registerGlobalChartPlugins() {
  Chart.register({
    // List global plugins here: automatically applied to all charts
    // Global plugins can still be individually disabled on specific charts
  });
}
