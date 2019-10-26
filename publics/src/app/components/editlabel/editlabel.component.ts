import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LabelsService } from 'src/app/services/labels/labels.service';
@Component({
  selector: 'app-editlabel',
  templateUrl: './editlabel.component.html',
  styleUrls: ['./editlabel.component.scss']
})
export class EditlabelComponent implements OnInit {
  labelsData;
  userid;
  templabel;
  constructor(private lsvc: LabelsService, private dialogRef: MatDialogRef<EditlabelComponent>, @Inject(MAT_DIALOG_DATA) private data) {
    this.labelsData = this.data.labelsdaata;
    this.userid = this.data.useraid;
    this.templabel = JSON.parse(JSON.stringify(this.labelsData));
  }

  ngOnInit() {
  }
  addnewlabel(newlabel) {
    console.log(newlabel);
    if (newlabel && !this.labelsData.some(ele => ele.label === newlabel)) {
      this.lsvc.createlabel({
        user_id: this.userid,
        label: newlabel.toLowerCase()
      })
        .subscribe(result => {
          const temp = JSON.stringify(result);
          const results = JSON.parse(temp);
          console.log(results.message, ':', results);
          this.labelsData.unshift(results.data);
          this.templabel.unshift(results.data);
        },
          error => {
            console.log(error.error.message, ':', error.error);
          });
    }
  }
  edit(newlabel) {
    if (newlabel && !this.labelsData.some(ele => ele.label === newlabel)) {
      return true;
    } else {
      return false;
    }
  }
  savelabel(labele, labelindex) {
    this.lsvc.updatelabel({
      id: labele.id,
      label: labele.label

    })
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.labelsData[labelindex] = labele;
        this.templabel = JSON.parse(JSON.stringify(this.labelsData));
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  deletelabel(labeleid, labelindex) {
    this.lsvc.deletelabel(labeleid)
      .subscribe(result => {
        const temp = JSON.stringify(result);
        const results = JSON.parse(temp);
        console.log(results.message, ':', results);
        this.labelsData.splice(labelindex, 1);
        this.templabel.splice(labelindex, 1);
        console.log(this.labelsData);
      },
        error => {
          console.log(error.error.message, ':', error.error);
        });
  }
  done() {
    this.dialogRef.close();
  }
}
