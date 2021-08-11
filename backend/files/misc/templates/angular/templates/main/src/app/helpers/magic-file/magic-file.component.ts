// Angular and system imports.
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, EventEmitter, Input, Output } from '@angular/core';

// Application specific imports.
import { HttpService } from '@app/services/http-service';

/**
 * File uploader component, allowing you to browse for and upload a file.
 * Example usage can be found below.

  <app-magic-file
    *ngIf="canEditColumn('filename')"
    [model]="data.entity"
    field="filename"
    placeholder="File"
    class="entity-edit-field"
    uploadUrl="/YOUR_MODULE_NAME/upload-file"
    (change)="changed('filename')">
  </app-magic-file>

 */
@Component({
  selector: 'app-magic-file',
  templateUrl: './magic-file.component.html',
  styleUrls: ['./magic-file.component.scss'],
})
export class MagicFileComponent {
  /**
   * Model you're databinding towards.
   */
  @Input() public model: any;

  /**
   * Key in the model, that you want this particular object
   * to be databound towards.
   */
  @Input() public field: string;

  /**
   * Placeholder value (tooltip) of component.
   */
  @Input() public placeholder: string;

  /**
   * Upload URL to use when uploading images.
   */
  @Input() public uploadUrl: string;

  /**
   * Callback to invoke once item is changed.
   */
  @Output() public change: EventEmitter<any> = new EventEmitter();

  /**
   * Creates an instance of your component.
   *
   * @param httpService Needed to actually upload the image(s).
   */
  constructor(
    private snack: MatSnackBar,
    private httpService: HttpService) { }

  /**
   * Invoked when file uploader should be clicked.
   */
  public clickFileUploader() {

    // Simply clicking file uploader element to trigger 'browse for files'.
    document.getElementById('file_' + this.field).click()
  }

  /**
   * Invoked as user clicks the button to select a file.
   */
  public uploadFile(e: any) {

    // Retrieving selected file and uploading to server.
    const selectedFile = e.target.files[0];
    this.httpService.uploadFile(this.uploadUrl, selectedFile, this.model[this.field]).subscribe((result: any) => {

      // Assigning model
      this.model[this.field] = selectedFile.name;
      this.change?.emit();

    }, (error: any) => {

      // Oops, couldn't upload file ...
      this.snack.open(
        'ERROR: ' + (error?.error?.message || error || 'Unspecified error when trying to upload file'),
        null, {
          duration: 5000
        });
    });
  }
}