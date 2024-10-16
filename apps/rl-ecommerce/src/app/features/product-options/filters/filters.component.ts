import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { SliderModule } from 'primeng/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    NgClass,
    SliderModule,
    ReactiveFormsModule,
    CheckboxModule,
    FormsModule,
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent implements OnInit {
  isShowing: boolean[] = [true];
  // rangeValues = new FormControl([20, 30]);
  rangeValues = [20, 300];
  value: number = 50;

  ngOnInit() {
    // console.log(this.isShowing);
    // this.rangeValues.valueChanges.subscribe((val) => {
    //   console.log(val);
    // });
  }

  onToggleFilter(index: number) {
    this.isShowing[index] = !this.isShowing[index];
    console.log(this.isShowing);
  }
}
