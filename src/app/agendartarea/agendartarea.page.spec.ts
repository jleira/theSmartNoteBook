import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgendartareaPage } from './agendartarea.page';

describe('AgendartareaPage', () => {
  let component: AgendartareaPage;
  let fixture: ComponentFixture<AgendartareaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendartareaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AgendartareaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
