/*
 * Automatically generated by Magic
 */

// Angular and system imports.
import { Observable } from 'rxjs';
import { Component, EventEmitter, Input, Output } from '@angular/core';

// Helper libraries.
import { NgxImageCompressService } from 'ngx-image-compress';

/**
 * Image uploader component, allowing you to browse for and upload an image.
 * This component automatically resize the image according to its configuration
 * if you set its maxWidth or maxHeight properties. Example usage can be found
 * below.
 * 
 * <app-magic-image
 *   [model]="data.entity"
 *   key="image"
 *   placeholder="Image"
 *   class="entity-edit-field"
 *   maxWidth="1024"
 *   maxHeight="800"
 *   [upload]="service.uploadImage.bind(service)"
 *   (change)="changed('image')">
 * </app-magic-image>
 * 
 * Notice, the [upload] callback needs to be a function taking two arguments;
 * - The image itself as a base64 encoded string
 * - The type of image being e.g. 'jpeg', 'png' etc.
 * 
 * Typically you can simply use the HttpService.uploadImage method here, assuming
 * you have a backend endpoint capable of handling the invocation.
 */
@Component({
  selector: 'app-magic-image',
  templateUrl: './magic-image.component.html',
  styleUrls: ['./magic-image.component.scss'],
})
export class MagicImageComponent {
  /**
   * Model you're databinding towards.
   */
  @Input() public model: any;

  /**
   * Key in the model, that you want this particular object
   * to be databound towards.
   */
  @Input() public key: string;

  /**
   * Maximum width of image.
   */
  @Input() public maxWidth?: number;

  /**
   * Maximum height of image.
   */
  @Input() public maxHeight?: number;

  /**
   * Placeholder value (tooltip) of component.
   */
  @Input() public placeholder: string;

  /**
   * Observable callback for component to upload image.
   */
   @Input() public upload: (image: string, type: string) => Observable<any>;

  /**
   * Callback to invoke once item is changed.
   */
   @Output() public change: EventEmitter<any> = new EventEmitter();

  /**
   * Creates an instance of your component.
   * 
   * @param imageCompress Needed to resize images before we upload them to backend
   */
  constructor(private imageCompress: NgxImageCompressService) {}

  /**
   * Invoked as user clicks the button to select an image.
   */
  public selectImage() {

    // Asking user for an image.
    this.imageCompress.uploadFile().then(({image, orientation}) => {

      // Verifying user provided a maximum height/width, and if not, uploading image as is.
      if (this.maxHeight || this.maxWidth) {

        // Figuring out original size of image.
        const img = new Image();
        img.onload = () => {

          // Figuring out aspect ratio between max height/width and actual height/width.
          let widthRatio: number = null;
          let heightRatio: number = null;
          if (img.width > this.maxWidth) {
            widthRatio = this.maxWidth / img.width;
          }
          if (img.height > this.maxHeight) {
            heightRatio = this.maxHeight / img.height;
          }

          // Checking if image was larger in any direction that what our max height/width was.
          if (widthRatio || heightRatio) {

            // We need to find our smallest ratio to make sure image never exceeds the specified max height/width.
            const ratio = Math.min(widthRatio || 1, heightRatio || 1);

            // Resizing image.
            this.imageCompress.compressFile(image, orientation, ratio * 100, 100).then((resizedImage: string) => {

              // Uploading resized image.
              this.uploadImage(resizedImage);
            });

          } else {

            // Image is smaller in both axis than our maximum size, hence uploading as is.
            this.uploadImage(image);
          }
        };

        // Assigning the src will trigger loading, resulting in our above onload callback will be invoked once done.
        img.src = image;

      } else {

        // No max width/height declared - Hence, uploading image as is.
        this.uploadImage(image);
      }
    });
  }

  /*
   * Private helpers.
   */

  /*
   * Actual implementation of upload image, invoking our callback.
   */
  private uploadImage(image: string) {

    // Removing 'data:image/jpeg;base64,' parts of image data
    const cutoff = image.indexOf(',');
    const type = image.substring(0, cutoff).replace('data:image/', '').split(';')[0];
    image = image.substring(cutoff + 1);

    // Uploading image as base64 encoded bytes.
    this.upload(image, type).subscribe((uploadResult: any) => {

      // Assigning model.
      this.model[this.key] = uploadResult.filename;

      // Signaling image has changed.
      this.change?.emit();

    }, (error: any) => console.error('Something went wrong as MagicImage tried to upload an image'));
  }
}
