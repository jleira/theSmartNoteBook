import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpcionesatajoPage } from './opcionesatajo.page';

describe('OpcionesatajoPage', () => {
  let component: OpcionesatajoPage;
  let fixture: ComponentFixture<OpcionesatajoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpcionesatajoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OpcionesatajoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
