import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnimalService, Animal } from '../../../services/animal.service';

@Component({
  selector: 'app-edit-animal-modal',
  templateUrl: './edit-animal-modal.component.html',
  styleUrls: ['./edit-animal-modal.component.css']
})
export class EditAnimalModalComponent implements OnInit, OnChanges {
  @Input() animal: Animal | null = null;
  @Output() close = new EventEmitter<boolean>();

  animalForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  // Sample data for dropdowns
  animalTypes = ['Cow', 'Bull', 'Calf', 'Heifer', 'Steer'];
  genders = ['Male', 'Female'];

  constructor(private fb: FormBuilder, private animalService: AnimalService) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['animal'] && this.animal) {
      this.updateForm();
    }
  }

  initForm(): void {
    this.animalForm = this.fb.group({
      id: [null],
      code: ['', Validators.required],
      gender: ['', Validators.required],
      noFamily: ['', Validators.required],
      animalType: ['', Validators.required],
      weight: [null, [Validators.required, Validators.min(0)]],
      weightDate: ['', Validators.required],
      description: ['']
    });

    if (this.animal) {
      this.updateForm();
    }
  }

  updateForm(): void {
    if (this.animal) {
      // Format the date to YYYY-MM-DD for the date input
      const weightDate = this.animal.weightDate ?
        new Date(this.animal.weightDate).toISOString().split('T')[0] :
        new Date().toISOString().split('T')[0];

      this.animalForm.patchValue({
        id: this.animal.id,
        code: this.animal.code,
        gender: this.animal.gender,
        noFamily: this.animal.noFamily,
        animalType: this.animal.animalType,
        weight: this.animal.weight,
        weightDate: weightDate,
        description: this.animal.description
      });
    }
  }

  onSubmit(): void {
    if (this.animalForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.animalForm.controls).forEach(key => {
        const control = this.animalForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.animalService.updateAnimal(this.animalForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.close.emit(true); // Refresh the list
      },
      error: (error) => {
        console.error('Error updating animal', error);
        this.errorMessage = 'Failed to update animal. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  closeModal(): void {
    this.close.emit(false); // Don't refresh the list
  }
}
