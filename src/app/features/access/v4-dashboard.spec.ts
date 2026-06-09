import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AlertController } from '@ionic/angular/standalone';

import { AuthService } from '../../core/services/auth.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { V4Dashboard } from './v4-dashboard';

describe('V4Dashboard', () => {
  const scheduleServiceMock = {
    nextClass$: {
      subscribe: (handler: (value: any) => void) => {
        handler({
          id: 'c1',
          user_id: 'u1',
          subject: 'Álgebra Lineal',
          day_of_week: 2,
          start_time: '07:00',
          end_time: '09:00',
          room_label: 'Bloque 5 - 203'
        });
        return { unsubscribe: () => void 0 };
      }
    }
  };

  const authServiceMock = {
    signOut: () => Promise.resolve()
  };

  const alertControllerMock = {
    create: async () => ({
      present: async () => void 0,
      onDidDismiss: async () => ({ role: 'cancel' })
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V4Dashboard],
      providers: [
        provideRouter([]),
        { provide: ScheduleService, useValue: scheduleServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: AlertController, useValue: alertControllerMock }
      ]
    }).compileComponents();
  });

  it('renders next class card and private dashboard heading', () => {
    const fixture = TestBed.createComponent(V4Dashboard);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Dashboard');
    expect(fixture.nativeElement.textContent).toContain('Próxima clase');
    expect(fixture.nativeElement.textContent).toContain('Álgebra Lineal');
  });

  it('shows empty schedule message when no next class exists', async () => {
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [V4Dashboard],
      providers: [
        provideRouter([]),
        {
          provide: ScheduleService,
          useValue: {
            nextClass$: {
              subscribe: (handler: (value: any) => void) => {
                handler(null);
                return { unsubscribe: () => void 0 };
              }
            }
          }
        },
        { provide: AuthService, useValue: authServiceMock },
        { provide: AlertController, useValue: alertControllerMock }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(V4Dashboard);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Sin clases próximas registradas');
    expect(fixture.nativeElement.textContent).toContain('Sin horario aún');
  });
});
