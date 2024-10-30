import React, { useMemo } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useAsyncFn, useToggle } from 'react-use';
import { Form, Modal } from 'react-bootstrap';
import { CalendarCreateDto } from '../api/generated/index.defs.ts';
import { CalendarsService } from '../api/generated/CalendarsService.ts';
import { toast } from 'react-toastify';
import { notify } from '../hooks/use-subscription.ts';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColorPicker, IColor, useColor } from 'react-color-palette';

const schema = z.object({
  name: z.string(),
  displayColor: z.string().optional().nullable(),
});

export const CreateCalendar: React.FC = () => {
  const [on, toggle] = useToggle(false);

  const handleClose = () => {
    toggle(false);
  };

  const [, submit] = useAsyncFn(async (values: CalendarCreateDto) => {
    const response = await CalendarsService.create({ body: values });

    if (response.hasErrors) {
      response.errors.map((error) => toast.error(error.errorMessage));
      return;
    }

    toast.success('Calendar Created');
    notify('calendar-refresh', undefined);
    handleClose();
  });

  const defaultValues: CalendarCreateDto = useMemo(
    () => ({
      name: '',
      displayColor: undefined,
    }),
    []
  );

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<CalendarCreateDto>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const randomColor = useMemo(
    () => '#' + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, '0'),
    []
  );

  const [color, setColor] = useColor(randomColor);

  const handleColorChange = (color: IColor) => {
    setColor(() => color);
    setValue('displayColor', color.hex);
  };

  return (
    <>
      <button className={'btn btn-primary'} onClick={() => toggle(true)}>
        <div className={'hstack gap-1'}>
          <div>
            <FaPlus />
          </div>
          <div>Create Calendar</div>
        </div>
      </button>
      <Modal show={on} onHide={handleClose}>
        <Modal.Header closeButton={true}>
          <h5>Create Calendar</h5>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(submit)}>
            <div className={'grid'}>
              <div className={'row mb-2'}>
                <div className={'col-md-6'}>
                  <Form.Group>
                    <Form.Label column={false} className={'form-required'}>
                      Name
                    </Form.Label>
                    <Form.Control
                      type={'text'}
                      isValid={Boolean(errors.name)}
                      {...register('name')}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className={'row mb-4'}>
                <div className={'col-md-6'}>
                  <Form.Group>
                    <Form.Label column={false}>Display Color</Form.Label>
                    <ColorPicker
                      onChange={handleColorChange}
                      color={color}
                      hideInput={['rgb', 'hsv']}
                      hideAlpha
                    />
                  </Form.Group>
                </div>
              </div>
              <div className={'row'}>
                <div className={'col-md-12'}>
                  <div className={'hstack gap-3'}>
                    <div>
                      <button
                        className={'btn btn-secondary'}
                        type={'button'}
                        onClick={handleClose}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className={'ms-auto'}>
                      <button className={'btn btn-primary'} type={'submit'}>
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
