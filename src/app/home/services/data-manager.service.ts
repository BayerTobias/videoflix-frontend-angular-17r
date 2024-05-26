import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { Video } from '../../models/video.model';
import { VideoResponse } from '../interfaces/video-response-interface';

@Injectable({
  providedIn: 'root',
})
export class DataManagerService {
  public publicVideos: Video[] = [];
  public privateVideos: Video[] = [];

  private http = inject(HttpClient);

  constructor() {}

  async getPublicVideos() {
    const url = environment.baseUrl + '/videos/?visibility=public';

    try {
      const resp = (await lastValueFrom(
        this.http.get(url)
      )) as Array<VideoResponse>;
      const videos = resp.map(
        (videoData: VideoResponse) => new Video(videoData)
      );
      this.publicVideos = videos;
      console.log(videos);
    } catch (err) {
      console.error(err);
    }
  }

  async getPrivateVideos() {
    const url = environment.baseUrl + '/videos/?visibility=private';

    try {
      const resp = (await lastValueFrom(
        this.http.get(url)
      )) as Array<VideoResponse>;
      const videos = resp.map(
        (videoData: VideoResponse) => new Video(videoData)
      );
      this.privateVideos = videos;
      console.log(videos);
    } catch (err) {
      console.error(err);
    }
  }

  async uploadVideo(formData: FormData) {
    const url = environment.baseUrl + '/videos/';
    const body = formData;

    return lastValueFrom(this.http.post(url, body));
  }
}
