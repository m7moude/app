import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface MilkRecord {
  milk: number;
  fatPercentage: number;
  date?: string; // Optional date field for tracking when the milk was collected
}

export interface Dairy {
  id?: number;
  code: string;
  animalType: string;
  noFamily: string;
  milk: MilkRecord[];
  weight: number;
  weightDate: string;
  dateFertilization: string;
  expectedDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class DairyService {
  private apiUrl = 'https://sra.runasp.net/api';

  constructor(private http: HttpClient) { }

  getAllDairy(): Observable<Dairy[]> {
    return this.http.get<Dairy[]>(`${this.apiUrl}/Dairy`).pipe(
      catchError(error => {
        console.error('Error fetching dairy records', error);
        // Return mock data for demo purposes
        return of(this.getMockDairyData());
      })
    );
  }

  getDairyById(id: number): Observable<Dairy> {
    return this.http.get<Dairy>(`${this.apiUrl}/Dairy/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching dairy record with id ${id}`, error);
        // Return mock data for the requested ID
        const mockData = this.getMockDairyData().find(d => d.id === id);
        return of(mockData || this.getMockDairyData()[0]);
      })
    );
  }

  createDairy(dairy: Dairy): Observable<Dairy> {
    return this.http.post<Dairy>(`${this.apiUrl}/Dairy`, dairy).pipe(
      catchError(error => {
        console.error('Error creating dairy record', error);
        // Return the dairy object with a mock ID for demo purposes
        return of({
          ...dairy,
          id: Math.floor(Math.random() * 1000) + 10
        });
      })
    );
  }

  updateDairy(dairy: Dairy): Observable<Dairy> {
    return this.http.put<Dairy>(`${this.apiUrl}/Dairy/${dairy.id}`, dairy).pipe(
      catchError(error => {
        console.error(`Error updating dairy record with id ${dairy.id}`, error);
        // Return the updated dairy object for demo purposes
        return of(dairy);
      })
    );
  }

  deleteDairy(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Dairy/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting dairy record with id ${id}`, error);
        // Return success for demo purposes
        return of({ success: true });
      })
    );
  }

  addMilkRecord(dairyId: number, milkRecord: MilkRecord): Observable<Dairy> {
    // In a real API, this would be a specific endpoint
    return this.getDairyById(dairyId).pipe(
      catchError(error => {
        console.error(`Error adding milk record to dairy with id ${dairyId}`, error);
        // Return mock data for demo purposes
        const mockDairy = this.getMockDairyData().find(d => d.id === dairyId) || this.getMockDairyData()[0];
        mockDairy.milk.push(milkRecord);
        return of(mockDairy);
      })
    );
  }

  // Mock data for testing and development
  private getMockDairyData(): Dairy[] {
    return [
      {
        id: 1,
        code: 'D001',
        animalType: 'Cow',
        noFamily: 'F1',
        milk: [
          { milk: 28.5, fatPercentage: 3.8, date: '2023-05-10' },
          { milk: 30.2, fatPercentage: 3.9, date: '2023-05-11' },
          { milk: 27.8, fatPercentage: 3.7, date: '2023-05-12' }
        ],
        weight: 550,
        weightDate: '2023-05-01',
        dateFertilization: '2023-03-15T10:30:00.000Z',
        expectedDate: '2023-12-20T10:30:00.000Z'
      },
      {
        id: 2,
        code: 'D002',
        animalType: 'Cow',
        noFamily: 'F2',
        milk: [
          { milk: 32.1, fatPercentage: 4.0, date: '2023-05-10' },
          { milk: 31.5, fatPercentage: 3.9, date: '2023-05-11' },
          { milk: 33.0, fatPercentage: 4.1, date: '2023-05-12' }
        ],
        weight: 580,
        weightDate: '2023-05-02',
        dateFertilization: '2023-02-20T09:15:00.000Z',
        expectedDate: '2023-11-25T09:15:00.000Z'
      },
      {
        id: 3,
        code: 'D003',
        animalType: 'Cow',
        noFamily: 'F1',
        milk: [
          { milk: 25.5, fatPercentage: 3.5, date: '2023-05-10' },
          { milk: 26.2, fatPercentage: 3.6, date: '2023-05-11' },
          { milk: 24.8, fatPercentage: 3.4, date: '2023-05-12' }
        ],
        weight: 520,
        weightDate: '2023-05-03',
        dateFertilization: '2023-04-05T11:45:00.000Z',
        expectedDate: '2024-01-10T11:45:00.000Z'
      },
      {
        id: 4,
        code: 'D004',
        animalType: 'Cow',
        noFamily: 'F3',
        milk: [
          { milk: 29.8, fatPercentage: 3.9, date: '2023-05-10' },
          { milk: 30.5, fatPercentage: 4.0, date: '2023-05-11' },
          { milk: 28.9, fatPercentage: 3.8, date: '2023-05-12' }
        ],
        weight: 560,
        weightDate: '2023-05-04',
        dateFertilization: '2023-03-25T08:30:00.000Z',
        expectedDate: '2023-12-30T08:30:00.000Z'
      },
      {
        id: 5,
        code: 'D005',
        animalType: 'Cow',
        noFamily: 'F2',
        milk: [
          { milk: 27.2, fatPercentage: 3.7, date: '2023-05-10' },
          { milk: 28.1, fatPercentage: 3.8, date: '2023-05-11' },
          { milk: 26.5, fatPercentage: 3.6, date: '2023-05-12' }
        ],
        weight: 540,
        weightDate: '2023-05-05',
        dateFertilization: '2023-04-10T13:20:00.000Z',
        expectedDate: '2024-01-15T13:20:00.000Z'
      }
    ];
  }
}
