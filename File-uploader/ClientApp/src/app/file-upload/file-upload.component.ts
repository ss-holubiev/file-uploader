import { Component } from '@angular/core';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { FilesService } from '../services/files.service';
import { Base64Util } from '../utils/base64.util';
import { catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

  constructor(private filesService: FilesService){

  }

  public uploadedFilesResult: UploadedFilesResult[] = [];

  public dropped(files: NgxFileDropEntry[]): void {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        this.uploadFile(droppedFile);
      }
    }
  }

  public fileOver(event){
    console.log(event);
  }

  public fileLeave(event){
    console.log(event);
  }

  /**
   * Uploads file to server
   * @param droppedFile File to upload
   */
  private async uploadFile(droppedFile: NgxFileDropEntry) {
    const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
    fileEntry.file( async (file: File) => {
      const fileBase64 = await Base64Util.fileToBase64(file);

      this.filesService.Add({
        fileContent: fileBase64.split(',')[1],
        fileName: file.name
      }).pipe(catchError(() => of({
        filePath: '' // If error returns empru object
      })))
      .subscribe((result) => {
        if(result.filePath) {
          this.uploadedFilesResult.push({
            filename: file.name,
            newFilePath: result.filePath
          });
        } else {
          this.uploadedFilesResult.push({
            filename: file.name, 
            error: true
          });
        }
      });
    });

    
    
  }

}

interface UploadedFilesResult {
  filename: string,
  error?: boolean,
  newFilePath?: string
}
