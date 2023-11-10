import { Pipe, PipeTransform } from '@angular/core';
import { formatDuration, intervalToDuration } from 'date-fns';

@Pipe({
  name: 'timeFormat',
  standalone: true,
})
export class TimeFormatPipe implements PipeTransform {
  transform(hours: number): string {
    const msInterval = hours * 60 * 60 * 1000;

    const duration = intervalToDuration({ start: 0, end: msInterval });

    return formatDuration(duration);
  }
}
