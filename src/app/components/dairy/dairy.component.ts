import { Component, OnInit } from '@angular/core';
import { DairyService, Dairy, MilkRecord } from '../../services/dairy.service';

@Component({
  selector: 'app-dairy',
  templateUrl: './dairy.component.html',
  styleUrls: ['./dairy.component.css']
})
export class DairyComponent implements OnInit {
  dairyAnimals: Dairy[] = [];
  filteredDairyAnimals: Dairy[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  sortColumn = 'code';
  sortDirection = 'asc';

  // Modal control
  showAddModal = false;
  showEditModal = false;
  showAddMilkRecordModal = false;
  selectedDairy: Dairy | null = null;

  // Confirmation dialog
  showDeleteConfirmation = false;
  dairyToDelete: number | null = null;

  // Expanded rows for milk records
  expandedRows: Set<number> = new Set();

  constructor(private dairyService: DairyService) { }

  ngOnInit(): void {
    this.loadDairyAnimals();
  }

  loadDairyAnimals(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dairyService.getAllDairy().subscribe({
      next: (data) => {
        this.dairyAnimals = data;
        this.filteredDairyAnimals = [...this.dairyAnimals];
        this.sortDairyAnimals();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dairy animals', error);
        this.errorMessage = 'Failed to load dairy animals. Please try again later.';
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
      this.filteredDairyAnimals = this.dairyAnimals.filter(dairy =>
        dairy.code.toLowerCase().includes(search) ||
        dairy.animalType.toLowerCase().includes(search) ||
        dairy.noFamily.toLowerCase().includes(search)
      );
    } else {
      this.filteredDairyAnimals = [...this.dairyAnimals];
    }

    // Then sort
    this.sortDairyAnimals();
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

    this.sortDairyAnimals();
  }

  sortDairyAnimals(): void {
    this.filteredDairyAnimals.sort((a: any, b: any) => {
      let valueA, valueB;

      // Special handling for milk (use the latest milk record)
      if (this.sortColumn === 'milk') {
        valueA = a.milk.length > 0 ? a.milk[a.milk.length - 1].milk : 0;
        valueB = b.milk.length > 0 ? b.milk[b.milk.length - 1].milk : 0;
      } else if (this.sortColumn === 'fatPercentage') {
        valueA = a.milk.length > 0 ? a.milk[a.milk.length - 1].fatPercentage : 0;
        valueB = b.milk.length > 0 ? b.milk[b.milk.length - 1].fatPercentage : 0;
      } else {
        valueA = a[this.sortColumn];
        valueB = b[this.sortColumn];
      }

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

  toggleExpandRow(id: number | undefined): void {
    if (!id) return;

    if (this.expandedRows.has(id)) {
      this.expandedRows.delete(id);
    } else {
      this.expandedRows.add(id);
    }
  }

  isRowExpanded(id: number | undefined): boolean {
    return id ? this.expandedRows.has(id) : false;
  }

  getLatestMilkRecord(dairy: Dairy): MilkRecord | null {
    return dairy.milk.length > 0 ? dairy.milk[dairy.milk.length - 1] : null;
  }

  getTotalMilk(dairy: Dairy): number {
    return dairy.milk.reduce((sum, record) => sum + record.milk, 0);
  }

  getAverageFatPercentage(dairy: Dairy): number {
    if (dairy.milk.length === 0) return 0;
    const totalFat = dairy.milk.reduce((sum, record) => sum + record.fatPercentage, 0);
    return totalFat / dairy.milk.length;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getDaysUntilExpected(expectedDate: string): number {
    const today = new Date();
    const expected = new Date(expectedDate);
    const diffTime = expected.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(refresh: boolean): void {
    this.showAddModal = false;
    if (refresh) {
      this.loadDairyAnimals();
    }
  }

  openEditModal(dairy: Dairy): void {
    this.selectedDairy = dairy;
    this.showEditModal = true;
  }

  closeEditModal(refresh: boolean): void {
    this.showEditModal = false;
    this.selectedDairy = null;
    if (refresh) {
      this.loadDairyAnimals();
    }
  }

  openAddMilkRecordModal(dairy: Dairy): void {
    this.selectedDairy = dairy;
    this.showAddMilkRecordModal = true;
  }

  closeAddMilkRecordModal(refresh: boolean): void {
    this.showAddMilkRecordModal = false;
    this.selectedDairy = null;
    if (refresh) {
      this.loadDairyAnimals();
    }
  }

  confirmDelete(id: number | undefined): void {
    if (!id) return;
    this.dairyToDelete = id;
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.dairyToDelete = null;
  }

  deleteDairy(): void {
    if (!this.dairyToDelete) return;

    this.isLoading = true;
    this.dairyService.deleteDairy(this.dairyToDelete).subscribe({
      next: () => {
        this.dairyAnimals = this.dairyAnimals.filter(dairy => dairy.id !== this.dairyToDelete);
        this.filteredDairyAnimals = this.filteredDairyAnimals.filter(dairy => dairy.id !== this.dairyToDelete);
        this.showDeleteConfirmation = false;
        this.dairyToDelete = null;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error deleting dairy animal', error);
        this.errorMessage = 'Failed to delete dairy animal. Please try again later.';
        this.isLoading = false;

        // For demo purposes, remove from the list anyway
        this.dairyAnimals = this.dairyAnimals.filter(dairy => dairy.id !== this.dairyToDelete);
        this.filteredDairyAnimals = this.filteredDairyAnimals.filter(dairy => dairy.id !== this.dairyToDelete);
        this.showDeleteConfirmation = false;
        this.dairyToDelete = null;
      }
    });
  }
}
