
/*
 * Copyright(c) Thomas Hansen thomas@servergardens.com, all right reserved
 */

// Angular and system imports.
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Application specific imports.
import { AppManifest } from '../models/app-manifest';
import { BazarService } from '../services/bazar.service';
import { Response } from 'src/app/models/response.model';
import { FileService } from '../../files/services/file.service';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-view-installed-app-dialog',
  templateUrl: './view-installed-app-dialog.component.html',
  styleUrls: ['./view-installed-app-dialog.component.scss']
})
export class ViewInstalledAppDialogComponent implements OnInit {

  /**
   * Markdown fetched from app's README.md file.
   */
  public markdown: string;

  /**
   * Creates an instance of your component.
   * 
   * @param fileService Needed to display module's README file
   * @param bazarService Needed to be able to update app, if app needs updating
   * @param feedbackService Needed to display feedback to user.
   * @param data App's manifest or meta data
   * @param dialogRef Needed to manually close dialog from code
   */
  constructor(
    private fileService: FileService,
    private bazarService: BazarService,
    private feedbackService: FeedbackService,
    @Inject(MAT_DIALOG_DATA) public data: AppManifest,
    private dialogRef: MatDialogRef<ViewInstalledAppDialogComponent>) { }

  /**
   * Implementation of OnInit.
   */
  public ngOnInit() {

    // Retrieving app's README.md file, if it exists.
    this.fileService.listFiles(
      '/modules/' + this.data.module_name + '/',
      'README.md').subscribe((result: string[]) => {

      // Checking if invocation returned more than zero entries.
      if (result && result.length > 0) {

        // App has a README file, loading it, and making sure we display it.
        this.fileService.loadFile(
          '/modules/' + this.data.module_name +
          '/README.md').subscribe((markdown: string) => {

            // Assigning model.
            this.markdown = markdown;

          }, (error: any) => this.feedbackService.showError(error));
      }
    }, (error: any) => this.feedbackService.showError(error));
  }

  /**
   * Invoked when user wants to update the app.
   */
  public update() {

    // Invoking backend to update app.
    this.bazarService.update(this.data).subscribe((result: Response) => {

      // Verifying update invocation was a success.
      if (result.result === 'success') {

        // Success, now we need to initialise app, byt executing its 'magic.startup' folder's Hyperlamdba files.
        this.bazarService.install(
          this.data.module_name,
          this.data.new_version,
          this.data.name,
          this.data.token).subscribe((install: Response) => {

          // Verifying process was successful.
          if (install.result === 'success') {

            // Application was successfully initialised.
            this.feedbackService.showInfo('Application was successfully updated. You probably want to store the ZIP file later.');

            // This will signal parent form that app was updated, triggering refreshing of manifests.
            this.dialogRef.close(this.data);

            // Downloading module to local computer.
            this.bazarService.downloadLocally(this.data.module_name);
          }
        }, (error: any) => this.feedbackService.showError(error));
      }
    }, (error: any) => this.feedbackService.showError(error));
  }

  /**
   * Invoked when user wants to close dialog.
   */
  public close() {

    // Simply closing dialog without passing in data to caller.
    this.dialogRef.close();
  }
}