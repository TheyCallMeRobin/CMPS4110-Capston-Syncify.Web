import { CalendarEventGetDto } from '../api/generated/index.defs.ts';

export const QuickInfoHeader: React.FC<CalendarEventGetDto> = (props) => {
  return (
    <div className={'quick-info-header'}>
      <div className={'quick-info-content'}>
        <div className={'quick-info-title'}>{props.title}</div>
      </div>
    </div>
  );
};

export const QuickInfoBody: React.FC<CalendarEventGetDto> = (props) => {
  return <>{props.title}</>;
};

export const QuickInfoFooter: React.FC<CalendarEventGetDto> = (props) => {
  return <></>;
};
