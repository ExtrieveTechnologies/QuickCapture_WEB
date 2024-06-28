# QuickCapture Web 2.0.0
QuickCapture Web Scanning SDK-JS Imaging viewer library Specially designed for Web applications from Extrieve.

> It's not "**just**" a JS/web scanning Library. It's a "**document**" scanning/capture SDK evolved with **Best Quality**, **Highest Possible Compression**, **Image Optimisation**, of output document in mind.

> Also Equiped with a Web Viewer With PDF, TIFF , JPEG & PNG formats

> **Developer-friendly** & **Easy to integration** JS library with Windows service.


**QuickCapture** is a robust web library designed for comprehensive image processing tasks. This library offers a wide range of functionalities to enhance, transform, and manage image files seamlessly. Below are the key features of QuickCapture:

## Features

- **Attach File**: Easily attach image files from the local file system to the viewer for processing.
- **Scan from Scanner**: Directly scan images using a connected scanner.
- **Navigation**: Navigate to the first, last, previous, next page, and specific pages.
- **Transformations**: Perform various image transformations such as rotation, despeckle, black & white, grayscale, and invert image conversion.
- **Enhancement**: Enhance image quality with tools for adjusting brightness, contrast, dilate, erosion, sharpen, and remove border.
- **Annotations**: Include extract image, text annotate over image, fill color, and auto deskew.
- **Viewer Tools**: Utilize zoom, pan, and magnifier tools for detailed image inspection.
- **Information**: Access metadata and information about the image and files, get license information.
- **Output Build**: Generate and compile the processed images for final output as normal and stamped TIF.
- **Upload & Download**: Upload images to a server or download processed images from a server to the viewer.
- **Viewer Instances**: Create multiple instances of image viewers for comparative analysis or multitasking.

## Viewer Initialization

### Viewer Configuration

*Description:* The **config** allows users to modify some default options of the viewer such as `APP_NAME` to set the application name, `SERVICETIMEOUT` to set viewer timeout, **`LICENSE` to set the license string to activate the viewer (viewer will not work without a valid license)**, `IS_HTTPS` to set using with HTTPS URL or not, `UI_CONFIG` to hide the default toolbar & navbar of the viewer.

```javascript
const config = {
    APP_NAME: "TWAIN_VIEWER",
    SERVICE_URL: "http://127.0.0.1:29213/libtwain/",
    BASE_URL: "http://127.0.0.1",
    URL_DIR: "/libtwain/",
    PORTS: [29213, 55425, 29215],
    ACTIVEPORT: 29213,
    SERVICETIMEOUT: 20,
    LICENSE: <Provide the license details here>,
    IS_HTTPS: false,
    GetServiceURL() {
        return this.BASE_URL + ":" + this.ACTIVEPORT + this.URL_DIR;
    },
    UI_CONFIG: {
        TOOLBAR: true,
        NAVBAR: true
    }
};
```

### Viewer Initialization & Callback Events

*Description:* The `initScanViewer` function initializes the viewer class with the class object named **QuickCaptureInterface** and license activation along with allowed input file via filter and multi-file select enable or disable. Callback events trigger respective events.

#### Common Events
1. `AcquiredImage`: Triggered for every image acquired.
2. `AcquisitionCompleted`: Triggered for every file acquisition session complete.
3. `URLOperationStarted`: Triggered once the upload or download process is started.
4. `URLOperationProgress`: Triggered while image upload or download is in progress.
5. `URLOperationCompleted`: Triggered once the image download or upload process is completed.
6. `URLOperationError`: Triggered if any error happens while the image download or upload process.
7. `AnnotationDrawn`: Triggered once the annotation over the image is done (with coordinates).

```javascript
// Viewer init with registering callback events
let initScanViewer = async () => {
    let ImgRootDivID = "ImgViewerRoot";
    
    let QuickCaptureInterface = new QuickCapture();
    await QuickCaptureInterface.init(ImgRootDivID, config, null);

    let allowedFiles = ["IMAGE + PDF Files", "*.png;*.jpeg;*.jpg;*.tiff;*.tif;*.pdf;*.bmp;"];

    QuickCaptureInterface.EnableMultiSelect(true);
    QuickCaptureInterface.SetInputFileFilter(allowedFiles);

    QuickCaptureInterface.RegisterEvent("URLOperationStarted", URLOperation_Started);
    QuickCaptureInterface.RegisterEvent("URLOperationProgress", URLOperation_Progress);
    QuickCaptureInterface.RegisterEvent("URLOperationCompleted", URLOperation_Completed);
    QuickCaptureInterface.RegisterEvent("URLOperationError", URLOperation_Error);
    QuickCaptureInterface.RegisterEvent("AcquisitionCompleted", Acquisition_Completed);
    QuickCaptureInterface.RegisterEvent("AcquiredImage", Acquired_Image);
    QuickCaptureInterface.RegisterEvent("AnnotationDrawn", Annotation_Drawn);
    QuickCaptureInterface.Library.ClearAndSetAppID("-1");
};
```

## Viewer Functionalities

### Attach File

#### Append From File

*Description:* The `AppendFromFile` functionality allows users to append any documents to the viewer. This is useful for incorporating any images quickly and efficiently in the document viewer.

*Usage:*
```javascript
QuickCaptureInterface.AppendFromFile();
```

#### Insert Before Page

*Description:* The `InsertBeforeCurrentPage` functionality allows users to insert pages before the current page in the viewer. This is useful for adding new pages at the beginning of the current page in the document viewer.

*Usage:*
```javascript
QuickCaptureInterface.InsertBeforeCurrentPage();
```

#### Insert After Page

*Description:* The `InsertAfterCurrentPage` functionality allows users to insert pages after the current page in the viewer. This is useful for adding new pages immediately following the current page in the document viewer.

*Usage:*
```javascript
QuickCaptureInterface.InsertAfterCurrentPage();
```

#### Replace Current Page

*Description:* The `InsertAtCurrentPage` functionality allows users to replace the current page in the viewer with a new document from the file system. This is useful for updating or correcting specific pages in the existing document viewer.

*Usage:*
```javascript
QuickCaptureInterface.InsertAtCurrentPage();
```

#### Append From Folder

*Description:* The `AppendFromFolder` functionality allows users to append all documents from a specified folder to the viewer. This is useful for quickly incorporating a large number of files from a directory into the document viewer.

*Usage:*
```javascript
QuickCaptureInterface.AppendFromFolder();
```

### Scanner

#### Select Scanner Device

*Description:* The `SelectSource` functionality allows users to select a scanner device from which to capture images or documents. This is essential for setting up the desired scanner before performing any scanning operations or selecting at the time of performing a scan from the scanner.

*Usage:*
```javascript
QuickCaptureInterface.SelectSource("");
```

#### Append from Scanner

*Description:* The `AppendFromScanner` functionality enables users to append scanned documents directly into the application from a connected scanner. This feature is essential for capturing physical documents and integrating them seamlessly into digital workflows.

*Usage:*
```javascript
QuickCaptureInterface.AppendFromScanner();
```

#### Insert Before Page

*Description:* The `InsertBeforeFromScanner` functionality allows users to insert scanned documents before the current page in the document viewer. This feature is useful for seamlessly integrating scanned content into existing digital documents at specific locations.

*Usage:*
```javascript
QuickCaptureInterface.InsertBeforeFromScanner();
```

#### Insert After Page

*Description:* The `InsertAfterFromScanner` functionality allows users to insert scanned documents after the current page in the document viewer. This feature is useful for seamlessly integrating scanned content into existing digital documents immediately following a specific location.

*Usage:*
```javascript
QuickCaptureInterface.InsertAfterFromScanner();
```

#### Replace Current Page

*Description:* The `ReplacePageFromScanner` functionality allows users to replace the current page in the document viewer with a scanned document. This feature is useful for updating existing digital documents with newly scanned content.

*Usage:*
```javascript
QuickCaptureInterface.ReplacePageFromScanner();
```

### Navigations

#### First Page

*Description:* The `NavigateToPage("firstpage")` functionality allows users to navigate to the first page of the document in the viewer. This feature is useful for quickly returning to the beginning of a document, especially when dealing with multi-page documents.

*Usage:*
```javascript
QuickCaptureInterface.NavigateToPage("firstpage");
```

#### Previous Page

*Description:* The `NavigateToPage("prevpage")` functionality allows users to navigate to the previous page of the document in the viewer. This feature is useful for sequentially reviewing or editing multi-page documents.

*Usage:*
```javascript
QuickCaptureInterface.NavigateToPage("prevpage");
```

#### Next Page

*Description:* The `NavigateToPage("nextpage")` functionality allows users to navigate to the next page of the document in the viewer or editor interface. This feature is useful for sequentially reviewing or editing multi-page documents.

*Usage:*
```javascript
QuickCaptureInterface.NavigateToPage("nextpage");
```

#### Last Page

*Description:* The `NavigateToPage("lastpage")` functionality allows users to navigate to the last page of the document in the viewer. This feature is useful for quickly accessing the end of multi-page documents.

*Usage:*
```javascript
QuickCaptureInterface.NavigateToPage("lastpage");
```

#### Goto Page

*Description:* The `NavigateToPage("gotopage", pageNo)` functionality allows users to navigate to a specific page of the document in the viewer. This feature is useful for quickly accessing a particular page within multi-page documents.

*Usage:*
```javascript
var pageNo = 5; //Replace with the desired page number
QuickCaptureInterface.NavigateToPage("gotopage", pageNo);
```

*Parameters:*
- `pageNo`: An integer

 parameter representing the page number to which the user wants to navigate.

### Transformations

#### Invert Image

*Description:* The `InvertPage` function inverts the colors of the current page in the document viewer.

*Usage:*
```javascript
QuickCaptureInterface.InvertPage();
```

#### Black and White

*Description:* The `SetForBlackandWhite` functionality converts the current page in the document viewer to a black and white image. **Both color & grayscale images are supported**

*Usage:*
```javascript
QuickCaptureInterface.SetForBlackandWhite();
```

#### Gray Image

*Description:* The `SetForGray` function converts the current page in the document viewer to a grayscale image. **Only color images are supported**

*Usage:*
```javascript
QuickCaptureInterface.SetForGray();
```

#### Auto Despeckle

*Description:* The `DespecklePage` functionality automatically removes small specks, noise, or artifacts from a scanned document or image to enhance their clarity and quality. **Supports black & white images**

*Usage:*
```javascript
QuickCaptureInterface.DespecklePage(ScanConfig.DespeckleQuality, 1);
```

*Parameters:*
- `ScanConfig.DespeckleQuality` (int): Level or intensity of the despeckling process applied to remove specks, noise, or artifacts from the scanned document or image. Allowed values range from 0-100.
- `Method`(int): Allowed to pass 1 by default in this parameter.

#### Rotate Image

*Description:* The `Rotate` functionality rotates the current page in the document viewer by a specified angle in degrees clockwise. This is useful for adjusting the orientation of images or documents that need to be viewed or printed in a different orientation.

*Usage:*
```javascript
QuickCaptureInterface.Rotate(rangle);
```

*Parameters:*
- `rangle` (float): Angle of rotation in degrees. Positive values rotate clockwise, while negative values rotate counterclockwise.

### Enhancements

#### Brightness

*Description:* The `setBrightness` function adjusts the brightness of the current image in the document viewer. This is useful for improving visibility or adjusting the overall lightness of the image. **Supports only color images**

*Usage:*
```javascript
QuickCaptureInterface.setBrightness(bvalue);
```

*Parameters:*
- `bvalue`: A number between -50 and +50.

#### Contrast

*Description:* The `setContrast` functionality adjusts the contrast of the current image in the document viewer. This is useful for enhancing the difference in intensity between the light and dark areas of the image. **Supports only color images**

*Usage:*
```javascript
QuickCaptureInterface.setContrast(cvalue);
```

*Parameters:*
- `cvalue`: A number between -50 and +50.

#### Smoothing

*Description:* The `setSmoothing` functionality typically denotes an enhancement process aimed at reducing noise or smoothing out abrupt transitions in the current image in the document viewer. **Supports color and grayscale images**

*Usage:*
```javascript
QuickCaptureInterface.setSmoothing(svalue);
```

*Parameters:*
- `svalue`: A number between -50 and +50.

#### Dilate

*Description:* Dilation functionality adds pixels to the boundaries of objects in an image. **Supports color and grayscale images**

*Usage:*
```javascript
QuickCaptureInterface.Dilate();
```

#### Erosion

*Description:* Erosion functionality removes pixels on object boundaries. **Supports color and grayscale images**

*Usage:*
```javascript
QuickCaptureInterface.Erode();
```

#### Sharpen

*Description:* It sharpens the current image in the viewer, enhancing edge contrast and making the image appear clearer. **Supports color and grayscale images**

*Usage:*
```javascript
QuickCaptureInterface.Sharpen();
```

#### Remove Border

*Description:* It helps in removing borders from an image typically by identifying and cropping out unwanted areas around the edges of the image. **Supports all color, grayscale, black & white images**

*Usage:*
```javascript
QuickCaptureInterface.RemoveBorder(ScanConfig.minwidth, ScanConfig.minheight);
```

*Parameters:*
- `ScanConfig.minwidth`: Width of removing edge (pass the same value for both width and height).
- `ScanConfig.minheight`: Height of removing edge (pass the same value for both width and height).

### Annotations

#### Extract

*Description:* The `DoExtract` functionality crops a selected area specified by an annotation and appends it to the desired place in the document viewer. This operation allows users to extract specific content from a document or image and add it sequentially to the existing document viewer.

*Usage:*
```javascript
// To trigger annotation draw
QuickCaptureInterface.DrawAnnotation(1);

// In Registered Annotate event
await QuickCaptureInterface.DoExtract(ExtLeft, ExtTop, ExtRight, ExtBottom, placement);
```

*Parameters:*
- `ExtLeft, ExtTop, ExtRight, ExtBottom`: Annotate callback event will provide all these 4 coordinates; pass the same to TextAnnotate.
- `placement`: Pass any one desired placement: "append, insertbefore, insertafter, overwrite".

#### Text Annotate

*Description:* The `TextAnnotate` functionality enables users to annotate documents or images by adding text at a specified location. This feature is useful for adding notes, comments, or labels directly onto the document or image content. Need to specify the operation as a "textannotation".

*Usage:*
```javascript
// To trigger annotation draw
QuickCaptureInterface.DrawAnnotation(1);

// In Registered Annotate event
QuickCaptureInterface.TextAnnotate(ExtLeft, ExtTop, ExtRight, ExtBottom, Msg);
```

*Parameters:*
- `ExtLeft, ExtTop, ExtRight, ExtBottom`: Annotate callback event will provide all these 4 coordinates; pass the same to TextAnnotate.
- `Msg`: Pass the desired message to print over the selected area (allowed 20 characters max).

#### Fill Color Inside

*Description:* The `DoWhiteOut` functionality allows users to fill a specified area inside an annotation with white color. This functionality is useful for wiping out specific content in images. **Supports black & white images**

*Usage:*
```javascript
// To trigger annotation draw
QuickCaptureInterface.DrawAnnotation(1);

// In Registered Annotate event
QuickCaptureInterface.DoWhiteOut(ExtLeft, ExtTop, ExtRight, ExtBottom);
```

*Parameters:*
- `ExtLeft, ExtTop, ExtRight, ExtBottom`: Annotate callback event will provide all these 4 coordinates; pass the same to TextAnnotate.

#### Fill Color Outside

*Description:* The `DoBorderWhiteOut` functionality allows users to fill the area outside a specified annotation with white color. This functionality is useful for wiping out contents in images outside the selected area. **Supports black & white images**

*Usage:*
```javascript
// To trigger annotation draw
QuickCaptureInterface.DrawAnnotation(1);

// In Registered Annotate event
QuickCaptureInterface.DoBorderWhiteOut(ExtLeft, ExtTop, ExtRight, ExtBottom);
```

*Parameters:*
- `ExtLeft, ExtTop, ExtRight, ExtBottom`: Annotate callback event will provide all these 4 coordinates; pass the same to TextAnnotate.

#### Auto Deskew

*Description:* The `DeskewPage` function automatically detects and corrects the skew angle of the current page in the document viewer. This is useful for straightening tilted images and aligning images. **Supports black & white images**

*Usage:*
```javascript
QuickCaptureInterface.DeskewPage(ScanConfig.MaxDeskewAngle);
```

*Parameters:*
- `maxDeskewAngle` (int): The maximum angle in degrees within which the function will attempt to deskew the image.

### Zoom / Pan

#### Set Zoom Factor

*Description:* The `SetZoomFactorWithZoom` function sets the zoom level of the document viewer based on a specified percentage. This allows users to zoom in or out to view the document at their desired scale, providing better control over document viewing and navigation.

*Usage:*
```javascript
QuickCaptureInterface.SetZoomFactorWithZoom(scale);
```

*Parameters:*
- `scale` (int): The scale ranges 0% to 300%, by default set to 0%.

#### Set Zoom Mouse

*Description:* The `SetMouseTool(1)` functionality allows users to zoom in and out of the document using the mouse. When activated, users can use the mouse to zoom in and out on the document, providing a more interactive and user-friendly experience for viewing document details.

*Usage:*
```javascript
QuickCaptureInterface.SetMouseTool(1);
```

#### Set Pan Mouse

*Description:* The `SetMouseTool(2)` functionality allows users to grab and drag the document within the viewer using the mouse. When activated, users can click and drag the document to move around the content, making it easier to navigate large documents without using scrollbars.

*Usage:*
```javascript
QuickCaptureInterface.SetMouseTool(2);
```

#### Set Magnifier

*Description:* The `SetMouseTool(3)` functionality enables a magnifying tool within the document viewer. This allows users to zoom in on specific areas of the document by hovering the mouse over them, providing a detailed view of small or intricate parts of the document. For zooming specific part use `ctrl + mouse scroll`.

*Usage:*
```javascript
QuickCaptureInterface.SetMouseTool(3);
```

#### Reset Mouse Tool

*Description:* The `ResetMouseTool` functionality will reset all active mouse tools, such as zoom, pan, and magnifier tools.

*Usage:*
```javascript
QuickCaptureInterface.ResetMouseTool();
```

### File Information

#### Show Image Info

*Description:* The

 `GetImageInfo` functionality provides information about the currently displayed image or the page number passed. This feature is useful for accessing details about the particular image/page.

*Usage:*
```javascript
QuickCaptureInterface.GetImageInfo(QuickCaptureInterface.CurrentPage);
```

*Parameters:*
- `page` (int): Pass page number to get image info, by default set to current page.

#### Show File Info

*Description:* The `GetFileInfo` functionality provides comprehensive information about the entire files currently loaded in the viewer. This feature is useful for accessing all files appended in the document viewer.

*Usage:*
```javascript
QuickCaptureInterface.GetFileInfo(index);
```

*Parameters:*
- `index` (int): Pass file index number to get file info, by default set to all file list.

#### Set Page Attribute

*Description:* The `SetPageAttribute` functionality provides access to set a unique identifier from the client app to identify a particular page while performing some actions.

*Usage:*
```javascript
QuickCaptureInterface.SetPageAttribute(attr, page);
```

*Parameters:*
- `attr` (string): Pass any string identifier.
- `page` (int): Pass page number in which this attribute needs to be set.

#### Get Page Attribute

*Description:* The `GetPageAttribute` functionality provides access to get a unique identifier which is set previously while performing some actions.

*Usage:*
```javascript
QuickCaptureInterface.GetPageAttribute(page);
```

*Parameters:*
- `page` (int): Pass page number to get the attribute.

#### Get License Info

*Description:* The `getServiceInfo` functionality retrieves information about the currently activated license. This feature is useful for accessing details related to the licensing of the application, such as license type, expiration date, and other relevant information.

*Usage:*
```javascript
QuickCaptureInterface.getServiceInfo();
```

### Remove Page

#### Discard Current Page

*Description:* The `DiscardPage` functionality allows users to remove or discard the currently displayed page from the document viewer. This feature is useful for document editing and management tasks where removing specific pages is necessary.

*Usage:*
```javascript
QuickCaptureInterface.DiscardPage();
```

#### Discard All Pages

*Description:* The `Discard All Pages` functionality allows users to remove or discard all pages from the document viewer and library. This feature is useful for clearing out the entire document set and library in one operation.

*Usage:*
```javascript
QuickCaptureInterface.ClearLibrary();
QuickCaptureInterface.ClearContents();
```

### Output Build

#### Save Normal TIF

*Description:* The `CopyOutput` functionality allows users to save the current document or image as a normal single TIF file format. This feature is useful for exporting documents or images in a standard and compressed format.

*Usage:*
```javascript
var Out = QuickCaptureInterface.GetNewOutputObj("output_file");
QuickCaptureInterface.AddToOutputObj(Out);
var s = await Out.FileSize();
var ret = await QuickCaptureInterface.CopyOutput(Out, "output_file.tif");
```

#### Save Stamped TIF

*Description:* The `Save Stamped TIF` functionality allows users to save the current document or image with a stamp applied. This feature is useful for adding text stamps, such as watermarks or annotations, to documents before generating output TIF.

*Usage:*
```javascript
var Out = QuickCaptureInterface.GetNewOutputObj("stamping_output");
QuickCaptureInterface.initStamping(StampingConfig.STAMPING_CONFIG, StampingConfig.STAMPING_CONFIG.TWAIN, StampingConfig.STAMPING_CONFIG.USER_INFO);
var stamp = QuickCaptureInterface.getStampingObject(0.04, -0.05);
QuickCaptureInterface.AddToOutputObj(Out);
Out.SetStampingInfo(stamp);
var s = await Out.FileSize();
var ret = await QuickCaptureInterface.CopyOutput(Out, "stamped_output.tif");
```

#### Get File Name & Size

*Description:* The `FileSize` and `FileName` functionality retrieves and displays information about the current output file, which includes its name and size.

*Usage:*
```javascript
var Out = QuickCaptureInterface.GetNewOutputObj("output_tif_file");
QuickCaptureInterface.AddToOutputObj(Out);
var fs = await Out.FileSize();
var fn = await Out.FileName();
```

#### Print Current Page

*Description:* The `PrintPage` functionality allows users to print the currently displayed page from the document viewer. This feature is useful for generating physical copies of documents directly from the application.

*Usage:*
```javascript
QuickCaptureInterface.PrintPage();
```

### Upload / Download

#### Download To Viewer

*Description:* The `downloadFiles` functionality allows users to download a file and display it directly in the viewer of the application. This feature is useful for fetching documents or images from external sources or from the server and presenting them within the application interface.

*Usage: From direct image or file link*
```javascript
var downloadurl = "https://example.com/image.pdf";
QuickCaptureInterface.Library.SetCurrentAppID("-1");
QuickCaptureInterface.Viewer.Contents.Add(downloadurl, "", 1, 1, "-1");
QuickCaptureInterface.LimitPageRange(0, 0);
QuickCaptureInterface.NavigateToPage("firstpage");
```

*Usage: From server*
```javascript
var downloadurl = "https://example.com/image.pdf";
let headerData = { "x-quickcapture-token": "token_value" };
let useServiceToDownload = true;
let httpMode = "get";
let requestData = { name: 'data', data: JSON.stringify({ uid: 123456, imagepool: "A" }) };

let downRes = await QuickCaptureInterface.downloadFiles(downloadurl, httpMode, requestData, headerData, useServiceToDownload);

//if download is via service, once all images downloaded completely then download complete will capture by URLOperationCompleted event

if (downRes) {

//here only json reponse data can be found

console.log("Downloaded file to viewer", downRes);

}

```

*Parameters:*

-  `httpMode`: need to specify whether using http mode is get or post

-  `downloadurl`: need to give image download url to get image file

-  `requestData`: need to specify payload data in key value object

-  `headerData`: need to send headers as shown in above example

-  `useServiceToDownload`: set this value to true always



Here is the corrected and completed remaining part of the documentation:

## Upload From Viewer

*Description:* The `Upload From Viewer` functionality enables users to upload an image or document from the viewer to the server as image/TIF. This feature is useful for uploading files directly from the viewer to the server for further processing or viewing.

*Function Name:* `uploadFiles`

*Usage:*

```javascript
// Required data to upload call trigger
let uploadUrl = "https://eo6lbhayb3d8qk8.m.pipedream.net";
let requestData = { name: 'data', data: JSON.stringify({ uid: 123456, imagepool: "A", timestamp: 1645123545 }) };
let headerData = { "x-quickcapture-token": "1sdGFH5k4KUJH45JKjf4KGHsK54JHsf54" };
let useServiceToUpload = true;
let httpMode = "post";

// Create a new upload output object
var Out = QuickCaptureInterface.GetNewOutputObj("upload_file");

// Add all images from viewer to output object
QuickCaptureInterface.AddToOutputObj(Out);

// Upload output from viewer to server
let upRes = await QuickCaptureInterface.uploadFiles(Out, httpMode, uploadUrl, requestData, headerData, useServiceToUpload);

// Check for desired response from server, then do further process
if (useServiceToUpload) {
    // If upload is via service, then response will be captured by URLOperationCompleted event
    upRes ? alert("Image upload success\nImage Id: " + imageid) : alert("Image upload failed");
} else {
    // If upload is via browser, then response will return here itself
    upRes ? alert("Image upload success\nImage Id: " + upRes.IMAGEID) : alert("Image upload failed");
}
```

*Parameters:*

- `Out`: Output object created from viewer needs to be passed here.
- `httpMode`: Specify whether using HTTP mode is GET or POST.
- `uploadUrl`: Provide the image upload URL.
- `requestData`: Specify payload data in key-value object.
- `headerData`: Send headers as shown in the above example.
- `useServiceToUpload`: Set this to false only if you want to use direct browser upload.

## Http Twain Installer

**Download Twain Installer**

*Description:* The `HTTP Twain Installer` functionality allows users to initiate the download of a TWAIN installer directly from an HTTP source. This feature is crucial for setting up or updating the TWAIN driver necessary for interfacing with imaging devices, such as scanners or cameras, from within the application.

*Function Name:* `DownloadInstaller`

*Usage:*

```javascript
// Example usage to download the TWAIN installer
QuickCaptureInterface.DownloadInstaller();
```

**Trigger Service From Web**

*Description:* The `Trigger Service from Web` functionality allows users to initiate a request from a web-based interface to check if a specific application is installed, and if installed, it will trigger the service if it is in an inactive state.

*Function Name:* `triggerHttpTwain`

*Usage:*

```javascript
// To check if service is running or not, if installed will trigger service
QuickCaptureInterface.triggerHttpTwain();
```

## Second Viewer

**Open Viewer Instance**

*Description:* The `Open Viewer Instance` functionality allows users to open a new instance of the viewer within the application. This feature is useful for simultaneously viewing multiple documents or images side by side or for comparing two documents.

*Usage:*

```javascript
// HTML new viewer element id to create viewer instance
let ImgRootDivID = "ImgViewerRoot2";

QuickCaptureInterface1 = new QuickCapture();
await QuickCaptureInterface1.init(ImgRootDivID, config, QuickCaptureInterface.jsImageWizViewer);

// Use existing viewer jsImageWizViewer to get instance viewer
QuickCaptureInterface1.SingleDocument = false;

// Adding content from document library to instance viewer
QuickCaptureInterface1.AddLibToContent(0, 0, 0, "-1");

// Navigate to first page in instance viewer
QuickCaptureInterface1.NavigateToPage("firstpage");
```

[© 1996 - 2024 Extrieve Technologies](https://www.extrieve.com/)
