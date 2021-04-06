import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class FilesService {
    constructor(private http: HttpClient) {}

    public Add(fileAddRequest: FileAddRequest): Observable<FileAddResponse> {
        return this.http.post<FileAddResponse>('api/files/add', fileAddRequest);
    }
}

export interface FileAddRequest {
    fileContent: string;
    fileName: string;
}

export interface FileAddResponse {
    filePath: string;
}