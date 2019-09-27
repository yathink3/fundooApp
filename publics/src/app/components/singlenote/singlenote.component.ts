import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-singlenote',
  templateUrl: './singlenote.component.html',
  styleUrls: ['./singlenote.component.css']
})
export class SinglenoteComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<SinglenoteComponent>) { }

  ngOnInit() {
  }

}
