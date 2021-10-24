import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PagedetailPage } from './pagedetail.page';

describe('PagedetailPage', () => {
  let component: PagedetailPage;
  let fixture: ComponentFixture<PagedetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagedetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PagedetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
