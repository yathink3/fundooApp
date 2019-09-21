import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../services/notes/notes.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-get-all-note',
  templateUrl: './get-all-note.component.html',
  styleUrls: ['./get-all-note.component.css']
})
export class GetAllNoteComponent implements OnInit {
  items = [];
  isMatMenuOpen = false;
  data = JSON.parse(localStorage.getItem('userData'));
  constructor(private svc: NotesService, private route: Router, private router: ActivatedRoute) {
  }
  ngOnInit() {
    this.getAllNotes();

  }
  getAllNotes() {
    this.svc.getAllNotes(this.data.id)
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        console.log(results.data);
        this.items = results.data;
        this.items.forEach(element => {
          element.hover = false;
        });
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  mouseleave(data) {
    if (data === true && this.isMatMenuOpen === true) {
      return true;
    } else if (data === true) {
      return false;
    }
  }
  menuclicked() {
    this.isMatMenuOpen = true;
  }
  menuClosed() {
    this.isMatMenuOpen = false;
    return false;
  }
  savereminder() {
  }
}
