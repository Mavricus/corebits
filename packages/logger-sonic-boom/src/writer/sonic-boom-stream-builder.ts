import * as onExit from 'on-exit-leak-free';
import SonicBoom from 'sonic-boom';

export interface IFdWriteStream extends NodeJS.WritableStream {
  fd?: number;
}

export abstract class SonicBoomStreamBuilder {
  /**
   * This method is used to create a SonicBoom stream that writes to a file descriptor.
   * WARNING: This method creates a new stream that is closed when the process exits, but it does not close original
   * stream, and it is the caller's responsibility to close it.
   *
   * @param fdStream - A stream that has a file descriptor (fd) property. It can be a `process.stdout`, `process.stderr`.
   * @return A SonicBoom stream that writes to the file descriptor.
   **/

  static buildWriteStreamByFd(fdStream: IFdWriteStream): SonicBoom.SonicBoom {
    const stream = new (SonicBoom as unknown as typeof SonicBoom.SonicBoom)({ fd: fdStream.fd });
    SonicBoomStreamBuilder.registerOnExit(stream);
    return stream;
  }

  static buildWriteStreamByPath(path: string): SonicBoom.SonicBoom {
    const stream = new (SonicBoom as unknown as typeof SonicBoom.SonicBoom)({ dest: path });
    SonicBoomStreamBuilder.registerOnExit(stream);

    return stream;
  }

  private static registerOnExit(stream: SonicBoom.SonicBoom): void {
    onExit.register(stream, (self) => self.flushSync());
  }
}
