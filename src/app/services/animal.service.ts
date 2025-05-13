import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Animal {
  id: number;
  code: string;
  gender: string;
  noFamily: string;
  animalType: string;
  weight: number;
  weightDate: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private apiUrl = 'https://sra.runasp.net/api';

  constructor(private http: HttpClient) { }

  getAllAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.apiUrl}/Animal`).pipe(
      catchError(error => {
        console.error('Error fetching animals', error);
        return of([]);
      })
    );
  }

  getNewbornAnimals(): Observable<Animal[]> {
    // First try to get all animals and filter for newborns
    return this.getAllAnimals().pipe(
      map(animals => {
        // Filter for animals with animalType = 'New Born' (case insensitive)
        return animals.filter(animal =>
          animal.animalType && animal.animalType.toLowerCase() === 'new born'
        );
      }),
      catchError(error => {
        console.error('Error fetching newborn animals', error);

        // Return mock data for demo purposes
        return of([
          { id: 6, code: 'NB001', gender: 'Male', noFamily: 'F4', animalType: 'New Born', weight: 35, weightDate: '2023-06-05', description: 'Newborn calf, Holstein' },
          { id: 7, code: 'NB002', gender: 'Female', noFamily: 'F3', animalType: 'New Born', weight: 32, weightDate: '2023-06-07', description: 'Newborn calf, Jersey' },
          { id: 8, code: 'NB003', gender: 'Male', noFamily: 'F2', animalType: 'New Born', weight: 38, weightDate: '2023-06-10', description: 'Newborn calf, Angus' },
          { id: 9, code: 'NB004', gender: 'Female', noFamily: 'F1', animalType: 'New Born', weight: 30, weightDate: '2023-06-12', description: 'Newborn calf, Hereford' }
        ]);
      })
    );
  }

  getAnimalById(id: number): Observable<Animal> {
    return this.http.get<Animal>(`${this.apiUrl}/Animal/${id}`);
  }

  createAnimal(animal: Animal): Observable<Animal> {
    return this.http.post<Animal>(`${this.apiUrl}/Animal`, animal);
  }

  updateAnimal(animal: Animal): Observable<Animal> {
    return this.http.put<Animal>(`${this.apiUrl}/Animal/${animal.id}`, animal);
  }

  deleteAnimal(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Animal/${id}`);
  }
}
