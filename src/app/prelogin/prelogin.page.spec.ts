import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreloginPage } from './prelogin.page';

describe('PreloginPage', () => {
  let component: PreloginPage;
  let fixture: ComponentFixture<PreloginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreloginPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreloginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
