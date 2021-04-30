import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPostCardComponent } from './my-post-card.component';

describe('MyPostCardComponent', () => {
  let component: MyPostCardComponent;
  let fixture: ComponentFixture<MyPostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyPostCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
