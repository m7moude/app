import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { FeedService, Ingredient } from '../../../services/feed.service';
import { CustomDropdownComponent } from '../../../shared/custom-dropdown/custom-dropdown.component';

@Component({
  selector: 'app-add-feed-modal',
  templateUrl: './add-feed-modal.component.html',
  styleUrls: ['./add-feed-modal.component.css']
})
export class AddFeedModalComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  @ViewChild('ingredientPrice') ingredientPrice!: ElementRef;
  @ViewChild(CustomDropdownComponent) ingredientDropdown!: CustomDropdownComponent;

  feedForm: FormGroup;
  ingredients: Ingredient[] = [];
  selectedIngredientId: number | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private feedService: FeedService
  ) {
    this.feedForm = this.fb.group({
      name: ['', [Validators.required]],
      quntity: [0, [Validators.required, Validators.min(0)]],
      ingredientPrice: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadIngredients();
  }

  loadIngredients(): void {
    this.isLoading = true;
    this.feedService.getIngredients().subscribe({
      next: (data) => {
        this.ingredients = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading ingredients', error);
        this.errorMessage = 'Failed to load ingredients. Please try again.';
        this.isLoading = false;

        // For demo purposes, add some mock ingredients if the API fails
        this.ingredients = [
          { id: 1, name: 'Corn' },
          { id: 2, name: 'Wheat' },
          { id: 3, name: 'Barley' },
          { id: 4, name: 'Soybean Meal' },
          { id: 5, name: 'Vitamins' }
        ];
      }
    });
  }

  get ingredientPriceControls() {
    return (this.feedForm.get('ingredientPrice') as FormArray).controls;
  }

  addIngredient(): void {
    const ingredientPriceArray = this.feedForm.get('ingredientPrice') as FormArray;
    ingredientPriceArray.push(
      this.fb.group({
        id: [null, Validators.required],
        price: [0, [Validators.required, Validators.min(0)]]
      })
    );
  }

  onIngredientSelected(ingredientId: any): void {
    this.selectedIngredientId = ingredientId;
  }

  addIngredientWithValues(price: string): void {
    if (this.selectedIngredientId === null) {
      alert('Please select an ingredient');
      return;
    }

    if (!price || parseFloat(price) < 0) {
      alert('Please enter a valid price');
      return;
    }

    // Check if this ingredient is already added
    const ingredientPriceArray = this.feedForm.get('ingredientPrice') as FormArray;
    const alreadyExists = ingredientPriceArray.controls.some(
      control => control.get('id')?.value === this.selectedIngredientId
    );

    if (alreadyExists) {
      alert('This ingredient is already added');
      return;
    }

    // Add the ingredient to the form
    ingredientPriceArray.push(
      this.fb.group({
        id: [this.selectedIngredientId, Validators.required],
        price: [parseFloat(price), [Validators.required, Validators.min(0)]]
      })
    );

    // Reset the input fields
    if (this.ingredientDropdown) {
      this.ingredientDropdown.selectedId = null;
      this.selectedIngredientId = null;
    }
    this.ingredientPrice.nativeElement.value = '';
  }

  removeIngredient(index: number): void {
    const ingredientPriceArray = this.feedForm.get('ingredientPrice') as FormArray;
    ingredientPriceArray.removeAt(index);
  }

  getIngredientName(id: number): string {
    if (!id) return '';
    const ingredient = this.ingredients.find(ing => ing.id === id);
    return ingredient ? ingredient.name : '';
  }

  onSubmit(): void {
    if (this.feedForm.invalid) {
      this.markFormGroupTouched(this.feedForm);
      return;
    }

    if (this.ingredientPriceControls.length === 0) {
      alert('Please add at least one ingredient');
      return;
    }

    this.isLoading = true;
    this.feedService.createFeed(this.feedForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeModal(true);
      },
      error: (error) => {
        console.error('Error creating feed', error);
        this.errorMessage = 'Failed to create feed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  closeModal(success = false): void {
    this.close.emit(success);
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
