import * as fs from 'fs';
import { randomUUID } from 'crypto';
import { ILogger, LogLevel } from '@corebits/logger-core';
import SonicBoom from 'sonic-boom';
import * as sinon from 'sinon';
import { LoggerSonicBoomFactory } from '../../src/factory/logger-sonic-boom-factory.js';
import { SonicBoomStreamBuilder } from '../../src/index.js';
import { LogFormatterMock } from '../mock/logger/log-formatter.mock.js';

const createStream = (path: string): Promise<SonicBoom.SonicBoom> =>
  new Promise((resolve) => {
    const stream = SonicBoomStreamBuilder.buildWriteStreamByPath(path);
    stream.on('ready', () => resolve(stream));
  });

describe('LoggerSonicBoomFactory', () => {
  let factory: LoggerSonicBoomFactory;
  let logger: ILogger;
  let logStream: SonicBoom.SonicBoom;
  let logFilePath: string;
  let formatter: LogFormatterMock;
  let clock: sinon.SinonFakeTimers;

  const formatterResult = 'Test Formatter Result';

  beforeEach(async () => {
    clock = sinon.useFakeTimers(new Date('2000-01-23T12:34:56.789Z'));
    logFilePath = `./log-${randomUUID()}.log`;
    logStream = await createStream(logFilePath);

    formatter = new LogFormatterMock();
    formatter.mocks.format.returns(formatterResult);

    factory = new LoggerSonicBoomFactory(formatter, logStream);

    logger = factory.create();
  });

  afterEach(() => {
    clock.restore();
    logStream.destroy();
    fs.unlinkSync(logFilePath);
  });

  it('should create a logger instance', () => {
    expect(logger).toBeDefined();
  });

  it('should log messages to the stream', () => {
    logger.info('Test log message', { data: 'test' });

    logStream.flushSync();

    const logContent = fs.readFileSync(logFilePath, 'utf8');
    expect(logContent).toContain(formatterResult);
    expect(formatter.mocks.format.calledOnce).toBe(true);
    expect(formatter.mocks.format.args[0]).toEqual([
      {
        timestamp: new Date('2000-01-23T12:34:56.789Z'),
        level: 'info',
        message: 'Test log message',
        context: 'no-context',
        details: { data: 'test' },
      },
    ]);
  });

  it('should set the correct log level', () => {
    expect(logger.level).toBe(LogLevel.INFO);

    logger = factory.create({ level: LogLevel.DEBUG });
    expect(logger.level).toBe(LogLevel.DEBUG);
  });

  it('should set logger context', () => {
    logger = factory.create({ context: 'test-scope' });

    logger.info('Test log message', { data: 'test' });
    logStream.flushSync();

    const logContent = fs.readFileSync(logFilePath, 'utf8');
    expect(logContent).toContain(formatterResult);
    expect(formatter.mocks.format.calledOnce).toBe(true);
    expect(formatter.mocks.format.args[0][0]).toEqual(expect.objectContaining({ context: 'test-scope' }));
  });
});
