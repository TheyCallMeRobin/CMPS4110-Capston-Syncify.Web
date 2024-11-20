import { useAsyncFn, useToggle } from 'react-use';
import { Offcanvas } from 'react-bootstrap';
import React, { useMemo } from 'react';
import {
  CalendarFilterType,
  useCalendarFilterStore,
} from './calendar-filter-store.ts';
import {
  CheckBoxSelection,
  MultiSelectComponent,
} from '@syncfusion/ej2-react-dropdowns';
import { Inject } from '@syncfusion/ej2-react-schedule';
import { useForm } from 'react-hook-form';
import { notify } from '../hooks/use-subscription.ts';
import { FaFilter } from 'react-icons/fa';
import { CalendarInfo } from './calendar-info.tsx';
import { SelectOption } from '../types/form.ts';

export const CalendarFilter: React.FC = () => {
  const [on, toggle] = useToggle(false);

  const handleClose = () => {
    toggle(false);
  };

  const store = useCalendarFilterStore;

  const selectedValues: SelectOption[] = useMemo(
    () =>
      store
        .getState()
        .allCalendars.filter((cal) =>
          store.getState().filter.calendarIds?.includes(cal.id)
        )
        .map((cal) => {
          const option: SelectOption = {
            value: String(cal.id),
            text: cal.name,
            id: cal.id,
          };
          return option;
        }),
    [store]
  );

  const options = useCalendarFilterStore.getState().allCalendars
    ? useCalendarFilterStore.getState().allCalendars.map((calendar) => ({
        value: String(calendar.id),
        text: calendar.name,
      }))
    : [];

  const { handleSubmit, register } = useForm<CalendarFilterType>();

  const [applyState, handleApply] = useAsyncFn(async (values) => {
    const transformed = values.calendarIds.map((id: { value: string }) =>
      parseInt(id.value)
    );
    useCalendarFilterStore.setState((state) => ({
      ...state,
      filter: {
        calendarIds: transformed,
      },
    }));

    handleClose();
    notify('calendar-refresh', undefined);
  });

  return (
    <>
      <div className={'p-2'}>
        <button className={'btn btn-primary'} onClick={() => toggle(true)}>
          <div className={'hstack gap-1'}>
            <div>
              <FaFilter />
            </div>
            <div>Filter</div>
          </div>
        </button>
      </div>
      <Offcanvas show={on} onHide={handleClose}>
        <Offcanvas.Header closeButton={true}>
          <Offcanvas.Title>Calendar Filter</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className={'vstack gap-4'}></div>
          <div>
            <form onSubmit={handleSubmit(handleApply)}>
              <div className={'mb-4'}>
                <label htmlFor="selectedCalendars">Selected Calendars</label>
                <MultiSelectComponent
                  id={'selectedCalendars'}
                  dataSource={options}
                  allowCustomValue={false}
                  title={'Selected Calendars'}
                  showSelectAll
                  showDropDownIcon
                  showClearButton
                  allowFiltering={false}
                  mode={'CheckBox'}
                  value={selectedValues}
                  allowObjectBinding
                  {...register('calendarIds')}
                >
                  <Inject services={[CheckBoxSelection]} />
                </MultiSelectComponent>

                <div className={'form-actions'}>
                  <button
                    type="submit"
                    className={'btn btn-primary'}
                    disabled={applyState.loading}
                  >
                    <div className={'hstack gap-1'}>
                      <div>
                        <FaFilter />
                      </div>
                      <div>Apply</div>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className={'mt-5'}>
            <CalendarInfo />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
