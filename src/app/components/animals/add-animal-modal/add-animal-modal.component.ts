import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimalService, Animal } from '../../../services/animal.service';

@Component({
  selector: 'app-add-animal-modal',
  templateUrl: './add-animal-modal.component.html',
  styleUrls: ['./add-animal-modal.component.css']
})
export class AddAnimalModalComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  @Input() defaultAnimalType: string = '';

  animalForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  // Sample data for dropdowns
  animalTypes = ['Cow', 'Bull', 'Calf', 'Heifer', 'Steer', 'New Born'];
  genders = ['Male', 'Female'];

  constructor(
    private fb: FormBuilder,
    private animalService: AnimalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();

    // Check if we're on the newborn page and set the animal type accordingly
    if (this.router.url.includes('/newborn')) {
      this.animalForm.get('animalType')?.setValue('New Born');
    }

    // If a default animal type was provided, use it
    if (this.defaultAnimalType) {
      this.animalForm.get('animalType')?.setValue(this.defaultAnimalType);
    }
  }

  initForm(): void {
    this.animalForm = this.fb.group({
      code: ['', Validators.required],
      gender: ['', Validators.required],
      noFamily: ['', Validators.required],
      animalType: ['', Validators.required],
      weight: [null, [Validators.required, Validators.min(0)]],
      weightDate: [new Date().toISOString().split('T')[0], Validators.required],
      description: ['']
    });
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

    const newAnimal: Animal = {
      id: 0, // Will be assigned by the server
      ...this.animalForm.value
    };

    this.animalService.createAnimal(newAnimal).subscribe({
      next: () => {
        this.isLoading = false;
        this.close.emit(true); // Refresh the list
      },
      error: (error) => {
        console.error('Error creating animal', error);
        this.errorMessage = 'Failed to create animal. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  closeModal(): void {
    this.close.emit(false); // Don't refresh the list
  }
}
