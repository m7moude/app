import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  feeds = [
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 },
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 },
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 },
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 },
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 },
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 },
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 },
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 },
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 },
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 },
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 },
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 },
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 },
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 },
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 },
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 },
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 },
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 },
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 },
    { name: 'Feed of Newborn', type: 'Newborn', protein: 22 }
  ];

  showAddModal = false;

  constructor() { }

  ngOnInit(): void {
    // You could load feeds from the API here
  }

  openAddFeedModal(): void {
    this.showAddModal = true;
  }

  closeAddFeedModal(success: boolean): void {
    this.showAddModal = false;

    if (success) {
      // Reload feeds or update the list
      // For now, we'll just show an alert
      alert('Feed added successfully!');
    }
  }
}