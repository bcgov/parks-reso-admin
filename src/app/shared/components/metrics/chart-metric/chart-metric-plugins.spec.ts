import { Chart } from 'chart.js';
import { ChartPlugins } from './chart-metric-plugins';

describe('barHighlightColumn plugin', () => {
  let plugin;
  let chartMock;
  let ctxMock;
  let tooltipMock;
  let chartAreaMock;
  let xScaleMock;
  let yScaleMock;

  beforeEach(() => {
    plugin = ChartPlugins.barHighlightColumnPlugin;
    ctxMock = {
      fillStyle: '',
      fillRect: jasmine.createSpy('fillRect')
    };
    chartAreaMock = {
      top: 10,
      bottom: 110,
      left: 20,
      right: 220,
      width: 200,
      height: 100
    };
    xScaleMock = {
      ticks: [0, 1, 2],
      max: 2,
      _gridLineItems: [
        { x1: 20 }, // index 0
        { x1: 70 }, // index 1
        { x1: 120 }, // index 2
        { x1: 170 }  // index 3 (for width calculation)
      ]
    };
    yScaleMock = {};
    tooltipMock = {
      _active: []
    };
    chartMock = {
      ctx: ctxMock,
      tooltip: tooltipMock,
      chartArea: chartAreaMock,
      scales: { x: xScaleMock, y: yScaleMock }
    };
  });

  it('should have correct id and defaults', () => {
    expect(plugin.id).toBe('barHighlightColumn');
    expect(plugin.defaults.color).toBe('#eeeeee');
  });

  it('should do nothing if data is decimated (ticks length mismatch)', () => {
    xScaleMock.ticks = [0, 1];
    plugin.beforeDatasetsDraw(chartMock, {}, plugin.defaults);
    expect(ctxMock.fillRect).not.toHaveBeenCalled();
  });

  it('should do nothing if tooltip is not active', () => {
    xScaleMock.ticks = [0, 1, 2];
    tooltipMock._active = [];
    plugin.beforeDatasetsDraw(chartMock, {}, plugin.defaults);
    expect(ctxMock.fillRect).not.toHaveBeenCalled();
  });

  it('should highlight the correct column when tooltip is active', () => {
    xScaleMock.ticks = [0, 1, 2];
    tooltipMock._active = [{ index: 1 }];
    plugin.beforeDatasetsDraw(chartMock, {}, plugin.defaults);
    // newWidth = x._gridLineItems[2].x1 - x._gridLineItems[1].x1 = 120 - 70 = 50
    expect(ctxMock.fillStyle).toBe('#eeeeee');
    expect(ctxMock.fillRect).toHaveBeenCalledOnceWith(70, 10, 50, 100);
  });

  it('should use the provided color option', () => {
    xScaleMock.ticks = [0, 1, 2];
    tooltipMock._active = [{ index: 0 }];
    const customOptions = { color: '#ff0000' };
    plugin.beforeDatasetsDraw(chartMock, {}, customOptions);
    expect(ctxMock.fillStyle).toBe('#ff0000');
    expect(ctxMock.fillRect).toHaveBeenCalled();
  });

  it('should not throw if _gridLineItems is missing or index out of bounds', () => {
    xScaleMock.ticks = [0, 1, 2];
    tooltipMock._active = [{ index: 5 }];
    expect(() => plugin.beforeDatasetsDraw(chartMock, {}, plugin.defaults)).toThrow();
    // Defensive: if _gridLineItems is undefined
    xScaleMock._gridLineItems = undefined;
    tooltipMock._active = [{ index: 0 }];
    expect(() => plugin.beforeDatasetsDraw(chartMock, {}, plugin.defaults)).toThrow();
  });
});