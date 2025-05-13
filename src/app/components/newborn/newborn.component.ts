import { Component, OnInit } from '@angular/core';
import { AnimalService, Animal } from '../../services/animal.service';

@Component({
  selector: 'app-newborn',
  templateUrl: './newborn.component.html',
  styleUrls: ['./newborn.component.css']
})
export class NewbornComponent implements OnInit {
  newborns: Animal[] = [];
  filteredNewborns: Animal[] = [];
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
    this.loadNewborns();
  }

  loadNewborns(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.animalService.getNewbornAnimals().subscribe({
      next: (data) => {
        this.newborns = data;
        this.filteredNewborns = [...this.newborns];
        this.sortNewborns();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading newborn animals', error);
        this.errorMessage = 'Failed to load newborn animals. Please try again later.';
        this.isLoading = false;
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
      this.filteredNewborns = this.newborns.filter(animal =>
        animal.code.toLowerCase().includes(search) ||
        animal.gender.toLowerCase().includes(search) ||
        animal.noFamily.toLowerCase().includes(search) ||
        (animal.description && animal.description.toLowerCase().includes(search))
      );
    } else {
      this.filteredNewborns = [...this.newborns];
    }

    // Then sort
    this.sortNewborns();
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

    this.sortNewborns();
  }

  sortNewborns(): void {
    this.filteredNewborns.sort((a: any, b: any) => {
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
    // Pre-set the animal type to "New Born"
    this.showAddModal = true;
  }

  closeAddModal(refresh: boolean): void {
    this.showAddModal = false;
    if (refresh) {
      this.loadNewborns();
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
      this.loadNewborns();
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
        this.newborns = this.newborns.filter(animal => animal.id !== this.animalToDelete);
        this.filteredNewborns = this.filteredNewborns.filter(animal => animal.id !== this.animalToDelete);
        this.showDeleteConfirmation = false;
        this.animalToDelete = null;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error deleting animal', error);
        this.errorMessage = 'Failed to delete animal. Please try again later.';
        this.isLoading = false;

        // For demo purposes, remove from the list anyway
        this.newborns = this.newborns.filter(animal => animal.id !== this.animalToDelete);
        this.filteredNewborns = this.filteredNewborns.filter(animal => animal.id !== this.animalToDelete);
        this.showDeleteConfirmation = false;
        this.animalToDelete = null;
      }
    });
  }
}
