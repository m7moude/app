import { Component, OnInit } from '@angular/core';
import { IngredientService, Ingredient } from '../../services/ingredient.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent implements OnInit {
  ingredients: Ingredient[] = [];
  filteredIngredients: Ingredient[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  sortColumn = 'name';
  sortDirection = 'asc';

  // Modal control
  showAddModal = false;
  showEditModal = false;
  selectedIngredient: Ingredient | null = null;

  // Confirmation dialog
  showDeleteConfirmation = false;
  ingredientToDelete: number | null = null;

  // Type mapping
  ingredientTypes = [
    { id: 0, name: 'Grain' },
    { id: 1, name: 'Protein Source' },
    { id: 2, name: 'Forage' },
    { id: 3, name: 'Mineral' },
    { id: 4, name: 'Vitamin' },
    { id: 5, name: 'Additive' },
    { id: 6, name: 'Other' }
  ];

  // Unit mapping
  unitTypes = [
    { id: 0, name: 'kg' },
    { id: 1, name: 'g' },
    { id: 2, name: 'lb' },
    { id: 3, name: 'oz' },
    { id: 4, name: 'ton' }
  ];

  constructor(private ingredientService: IngredientService) { }

  getTypeName(typeId: number): string {
    const type = this.ingredientTypes.find(t => t.id === typeId);
    return type ? type.name : 'Unknown';
  }

  getUnitName(unitId: number): string {
    const unit = this.unitTypes.find(u => u.id === unitId);
    return unit ? unit.name : 'Unknown';
  }

  ngOnInit(): void {
    this.loadIngredients();
  }

  loadIngredients(): void {
    this.isLoading = true;
    this.ingredientService.getAllIngredients().subscribe(
      (data) => {
        this.ingredients = data;
        this.applyFilter();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading ingredients', error);
        this.errorMessage = 'Failed to load ingredients. Please try again.';
        this.isLoading = false;

        // For demo purposes, add some mock data if the API fails
        this.ingredients = [
          { id: 1, name: 'Corn', type: 0, unit: 0, cp: 8.5, tdn: 80, cf: 2.2, me: 13.5 },
          { id: 2, name: 'Wheat', type: 0, unit: 0, cp: 12.6, tdn: 82, cf: 2.5, me: 13.2 },
          { id: 3, name: 'Barley', type: 0, unit: 0, cp: 11.5, tdn: 78, cf: 5.0, me: 12.8 },
          { id: 4, name: 'Soybean Meal', type: 1, unit: 0, cp: 44.0, tdn: 75, cf: 7.0, me: 12.5 },
          { id: 5, name: 'Alfalfa Hay', type: 2, unit: 0, cp: 17.0, tdn: 55, cf: 24.0, me: 9.2 },
          { id: 6, name: 'Vitamin Premix', type: 4, unit: 1, cp: 0, tdn: 0, cf: 0, me: 0 }
        ];
        this.applyFilter();
      }
    );
  }

  applyFilter(): void {
    // First filter by search term
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      this.filteredIngredients = this.ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(search) ||
        this.getTypeName(ingredient.type).toLowerCase().includes(search) ||
        this.getUnitName(ingredient.unit).toLowerCase().includes(search)
      );
    } else {
      this.filteredIngredients = [...this.ingredients];
    }

    // Then sort
    this.sortIngredients();
  }

  sortIngredients(): void {
    this.filteredIngredients.sort((a, b) => {
      const aValue = a[this.sortColumn as keyof Ingredient];
      const bValue = b[this.sortColumn as keyof Ingredient];

      if (aValue === undefined || bValue === undefined) {
        return 0;
      }

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = aValue < bValue ? -1 : (aValue > bValue ? 1 : 0);
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilter();
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      // Toggle direction if same column
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Default to ascending for new column
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.sortIngredients();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return 'fas fa-sort';
    }
    return this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(success: boolean): void {
    this.showAddModal = false;
    if (success) {
      this.loadIngredients();
    }
  }

  openEditModal(ingredient: Ingredient): void {
    this.selectedIngredient = { ...ingredient };
    this.showEditModal = true;
  }

  closeEditModal(success: boolean): void {
    this.showEditModal = false;
    this.selectedIngredient = null;
    if (success) {
      this.loadIngredients();
    }
  }

  confirmDelete(id: number): void {
    this.ingredientToDelete = id;
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.ingredientToDelete = null;
  }

  deleteIngredient(): void {
    if (!this.ingredientToDelete) return;

    this.isLoading = true;
    this.ingredientService.deleteIngredient(this.ingredientToDelete).subscribe(
      () => {
        this.isLoading = false;
        this.showDeleteConfirmation = false;
        this.ingredientToDelete = null;
        this.loadIngredients();
      },
      (error) => {
        console.error('Error deleting ingredient', error);
        this.errorMessage = 'Failed to delete ingredient. Please try again.';
        this.isLoading = false;
        this.showDeleteConfirmation = false;
        this.ingredientToDelete = null;
      }
    );
  }
}
