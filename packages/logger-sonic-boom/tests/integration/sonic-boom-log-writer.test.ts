import * as fs from 'fs';
import { randomUUID } from 'crypto';
import * as sinon from 'sinon';
import SonicBoom from 'sonic-boom';
import { LogLevel, SonicBoomLogWriter, SonicBoomStreamBuilder } from '../../src/index.js';

const createStream = (path: string): Promise<SonicBoom.SonicBoom> =>
  new Promise((resolve) => {
    const stream = SonicBoomStreamBuilder.buildWriteStreamByPath(path);
    stream.on('ready', () => resolve(stream));
  });

describe('SonicBoomLogWriter', () => {
  let writer: SonicBoomLogWriter;
  let logStream: SonicBoom.SonicBoom;
  let errorStream: SonicBoom.SonicBoom;
  let logFilePath: string;
  let errorFilePath: string;

  beforeEach(async () => {
    logFilePath = `log-${randomUUID()}.log`;
    logStream = await createStream(logFilePath);

    errorFilePath = `err-${randomUUID()}.log`;
    errorStream = await createStream(errorFilePath);

    writer = new SonicBoomLogWriter(logStream, errorStream);
  });

  afterEach(() => {
    fs.unlinkSync(logFilePath);
    fs.unlinkSync(errorFilePath);
  });

  describe('write', () => {
    afterEach(() => {
      logStream.destroy();
      errorStream.destroy();
    });

    it('should write trace message to log stream', () => {
      writer.write(LogLevel.TRACE, 'Trace message');
      logStream.flushSync();

      const logContent = fs.readFileSync(logFilePath, 'utf8');
      expect(logContent).toContain('Trace message');
    });

    it('should write debug message to log stream', () => {
      writer.write(LogLevel.DEBUG, 'Debug message');
      logStream.flushSync();

      const logContent = fs.readFileSync(logFilePath, 'utf8');
      expect(logContent).toContain('Debug message');
    });

    it('should write info message to log stream', () => {
      writer.write(LogLevel.INFO, 'Info message');
      logStream.flushSync();

      const logContent = fs.readFileSync(logFilePath, 'utf8');
      expect(logContent).toContain('Info message');
    });

    it('should write warn message to log stream', () => {
      writer.write(LogLevel.WARN, 'Warn message');
      logStream.flushSync();

      const logContent = fs.readFileSync(logFilePath, 'utf8');
      expect(logContent).toContain('Warn message');
    });

    it('should write error message to error stream', () => {
      writer.write(LogLevel.ERROR, 'Error message');
      errorStream.flushSync();

      const logContent = fs.readFileSync(errorFilePath, 'utf8');
      expect(logContent).toContain('Error message');
    });

    it('should write fatal message to error stream', () => {
      writer.write(LogLevel.CRITICAL, 'Critical message');
      errorStream.flushSync();

      const logContent = fs.readFileSync(errorFilePath, 'utf8');
      expect(logContent).toContain('Critical message');
    });

    it('should write error message to log stream if error stream is not provided', () => {
      writer = new SonicBoomLogWriter(logStream);
      writer.write(LogLevel.INFO, 'Info message');
      writer.write(LogLevel.ERROR, 'Error message');
      writer.write(LogLevel.CRITICAL, 'Critical message');
      logStream.flushSync();

      const logContent = fs.readFileSync(logFilePath, 'utf8');
      expect(logContent).toContain('Info message');
      expect(logContent).toContain('Error message');
      expect(logContent).toContain('Critical message');
    });
  });

  describe('close', () => {
    it('should close log stream', async () => {
      const logDestroySpy = sinon.spy(logStream, 'destroy');
      const errorDestroySpy = sinon.spy(errorStream, 'destroy');

      expect(logDestroySpy.called).toBe(false);
      expect(errorDestroySpy.called).toBe(false);

      await writer.close();

      expect(logDestroySpy.calledOnce).toBe(true);
      expect(errorDestroySpy.calledOnce).toBe(true);
    });

    it('should destroy log stream only once when error stream is not provided', async () => {
      writer = new SonicBoomLogWriter(logStream);

      const logDestroySpy = sinon.spy(logStream, 'destroy');
      const errorDestroySpy = sinon.spy(errorStream, 'destroy');
      expect(logDestroySpy.called).toBe(false);
      expect(errorDestroySpy.called).toBe(false);

      await writer.close();

      expect(logDestroySpy.calledOnce).toBe(true);
      expect(errorDestroySpy.called).toBe(false);
    });
  });
});
