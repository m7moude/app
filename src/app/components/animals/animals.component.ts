import { Component, OnInit } from '@angular/core';
import { AnimalService, Animal } from '../../services/animal.service';

@Component({
  selector: 'app-animals',
  templateUrl: './animals.component.html',
  styleUrls: ['./animals.component.css']
})
export class AnimalsComponent implements OnInit {
  animals: Animal[] = [];
  filteredAnimals: Animal[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  sortColumn = 'code';
  sortDirection = 'asc';

  // Modal control
  showAddModal = false;
  showEditModal = false;
  selectedAnimal: Animal | null = null;

  // Confirmation dialog
  showDeleteConfirmation = false;
  animalToDelete: number | null = null;

  constructor(private animalService: AnimalService) { }

  ngOnInit(): void {
    this.loadAnimals();
  }

  loadAnimals(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.animalService.getAllAnimals().subscribe({
      next: (data) => {
        this.animals = data;
        this.filteredAnimals = [...this.animals];
        this.sortAnimals();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading animals', error);
        this.errorMessage = 'Failed to load animals. Please try again later.';
        this.isLoading = false;

        // For demo purposes, add some mock data if the API fails
        this.animals = [
          { id: 1, code: 'A001', gender: 'Male', noFamily: 'F1', animalType: 'Cow', weight: 450, weightDate: '2023-05-10', description: 'Holstein dairy cow' },
          { id: 2, code: 'A002', gender: 'Female', noFamily: 'F1', animalType: 'Cow', weight: 500, weightDate: '2023-05-12', description: 'Jersey dairy cow' },
          { id: 3, code: 'A003', gender: 'Male', noFamily: 'F2', animalType: 'Bull', weight: 800, weightDate: '2023-05-15', description: 'Angus beef bull' },
          { id: 4, code: 'A004', gender: 'Female', noFamily: 'F3', animalType: 'Calf', weight: 120, weightDate: '2023-06-01', description: 'Newborn calf' },
          { id: 5, code: 'A005', gender: 'Male', noFamily: 'F2', animalType: 'Steer', weight: 650, weightDate: '2023-05-20', description: 'Hereford steer' }
        ];
        this.filteredAnimals = [...this.animals];
        this.sortAnimals();
      }
    });
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilter();
  }

  applyFilter(): void {
    // First filter by search term
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      this.filteredAnimals = this.animals.filter(animal =>
        animal.code.toLowerCase().includes(search) ||
        animal.animalType.toLowerCase().includes(search) ||
        animal.gender.toLowerCase().includes(search) ||
        animal.noFamily.toLowerCase().includes(search) ||
        (animal.description && animal.description.toLowerCase().includes(search))
      );
    } else {
      this.filteredAnimals = [...this.animals];
    }

    // Then sort
    this.sortAnimals();
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      // If already sorting by this column, toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // If sorting by a new column, set to ascending
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.sortAnimals();
  }

  sortAnimals(): void {
    this.filteredAnimals.sort((a: any, b: any) => {
      const valueA = a[this.sortColumn];
      const valueB = b[this.sortColumn];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        const comparison = valueA.localeCompare(valueB);
        return this.sortDirection === 'asc' ? comparison : -comparison;
      } else {
        const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        return this.sortDirection === 'asc' ? comparison : -comparison;
      }
    });
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

  closeAddModal(refresh: boolean): void {
    this.showAddModal = false;
    if (refresh) {
      this.loadAnimals();
    }
  }

  openEditModal(animal: Animal): void {
    this.selectedAnimal = animal;
    this.showEditModal = true;
  }

  closeEditModal(refresh: boolean): void {
    this.showEditModal = false;
    this.selectedAnimal = null;
    if (refresh) {
      this.loadAnimals();
    }
  }

  confirmDelete(id: number): void {
    this.animalToDelete = id;
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.animalToDelete = null;
  }

  deleteAnimal(): void {
    if (!this.animalToDelete) return;

    this.isLoading = true;
    this.animalService.deleteAnimal(this.animalToDelete).subscribe({
      next: () => {
        this.animals = this.animals.filter(animal => animal.id !== this.animalToDelete);
        this.filteredAnimals = this.filteredAnimals.filter(animal => animal.id !== this.animalToDelete);
        this.showDeleteConfirmation = false;
        this.animalToDelete = null;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error deleting animal', error);
        this.errorMessage = 'Failed to delete animal. Please try again later.';
        this.isLoading = false;

        // For demo purposes, remove from the list anyway
        this.animals = this.animals.filter(animal => animal.id !== this.animalToDelete);
        this.filteredAnimals = this.filteredAnimals.filter(animal => animal.id !== this.animalToDelete);
        this.showDeleteConfirmation = false;
        this.animalToDelete = null;
      }
    });
  }
}
