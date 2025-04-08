import { ILogMessageFormatter, LoggerFactory } from '@corebits/logger-core';
import SonicBoom from 'sonic-boom';
import { SonicBoomLogWriter } from '../writer/sonic-boom-log-writer.js';

export class LoggerSonicBoomFactory extends LoggerFactory {
  constructor(formater: ILogMessageFormatter, logStream: SonicBoom.SonicBoom, errorStream?: SonicBoom.SonicBoom) {
    super(formater, new SonicBoomLogWriter(logStream, errorStream));
  }
}
