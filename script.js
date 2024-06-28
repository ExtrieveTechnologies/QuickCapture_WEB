/*jshint esversion: 6 */
/**
 * QuickCapture WEB Document scanning with viewer
 * Extrieve Technologies
 * Your Expert in Document Management & AI Solutions.
 * www.extrieve.com
 * Info@extrieve.com | devsupport@extrieve.com
 * Author : Team Extrieve | Amal Karunakaran | Karthika V R
 * Date: 20-06-2024
 * Updated: 20-06-2024
 **/

//initilisation for viewer
let QuickCaptureInterface = null;
let QuickCaptureInterface1 = null;
var imageid = 0;
let Operation = null;
let ExtLeft, ExtRight, ExtTop, ExtBottom;

let quickcapturePlusDemoLicense = "eJxazXCBkQENMEIxMnhVuyf1nPEzB14wjwVM8kHZILX8UDYTkOQAs3kZXFJz8xUy80pSi/ISczjBgoIMqRUlRZmpZalwCR6wBCeDR0lJQUh5YmaeCFigBCGA7j4qAiY0vnFEcAAz0BshRaWpZl4ucLYdEls80N+FGehgQyNzPQMgNJSACuTkJyfmZOQXl0iCBZgZrKwMAQAAAP//AwBeTCvu";

//viewer image enahancement related config
const ScanConfig = {
    DespeckleQuality: 10,
    MaxDeskewAngle: 10,
    MaxThickness: 10,
    MinLength: 50,
    minwidth: 10,
    minheight: 10
};

//viewer init config
const config = {
    APP_NAME: "TWAIN_VIEWER",
    SERVICE_URL: "http://127.0.0.1:29213/libtwain/",
    BASE_URL: "http://127.0.0.1",
    URL_DIR: "/libtwain/",
    PORTS: [29213, 55425, 29215],
    ACTIVEPORT: 29213,
    SERVICETIMEOUT: 20,
    LICENSE: quickcapturePlusDemoLicense,
    IS_HTTPS: false,
    GetServiceURL() {
        var url = this.BASE_URL + ":" + this.ACTIVEPORT + this.URL_DIR;
        this.SERVICE_URL = url;
        return url;
    },
    UI_CONFIG: {
        TOOLBAR: true,
        NAVBAR: true
    }
};

// viewer init with callback events
let initScannerViewer = async () => {
    let ImgRootDivID = "ImgViewerRoot";
    QuickCaptureInterface = new QuickCapture();
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

//viewer instance init
let initViewerInstance = async () => {
    let ImgRootDivID = "ImgViewerRoot2";
    QuickCaptureInterface1 = new QuickCapture();
    await QuickCaptureInterface1.init(ImgRootDivID, config, QuickCaptureInterface.jsImageWizViewer);
    QuickCaptureInterface1.SingleDocument = false;
    QuickCaptureInterface1.AddLibToContent(0, 0, 0, "-1");
    QuickCaptureInterface1.NavigateToPage("firstpage");
};

//registered events
let URLOperation_Progress = (objURL, Status, Bytes, Total, StatusText) => {
    console.log(objURL.Operation + " in progress. Transfered Bytes " + Bytes + "/" + Total);
};

let URLOperation_Completed = (objURL, Bytes) => {
    window.status = "";
    var op = objURL.Operation;
    var numpages = objURL?.URLOperation?.NumPages;
    CurrentOperationDownload = false;
    var AverageSizePerPage = objURL.URLOperation.TotalBytes / objURL.URLOperation.NumPages;
    if (objURL.Operation == "UPLOAD") {
        var resp = objURL.URLOperation.PostResponse;
        if (resp.IMAGEID) {
            if (resp.IMAGEID) {
                imageid = resp.IMAGEID;
            }
            console.log("Imaging Id - " + imageid);
        }
    } else if (op == "DOWNLOAD" && numpages > 0) {
        QuickCaptureInterface.NavigateToPage("firstpage");
        ShowPageInfo();
    } else if (op == "DOWNLOAD" && numpages == 0) {
        let pcount = QuickCaptureInterface.Library.GetPageCount("-1");
        QuickCaptureInterface.AddLibToContent(0, 1, pcount, "-1");
        QuickCaptureInterface.NavigateToPage("firstpage");
        ShowPageInfo();
    }
    console.log(objURL.Operation + " Completed ");
    CurrentOperationUpload = false;
    return true;
};

let URLOperation_Error = (objURL, Status, IsResponseError) => {
    console.log(objURL.Operation + " Failed  Error -  " + IsResponseError);
    return;
};

let URLOperation_Started = (objURL) => {
    console.log(objURL.Operation + " started");
    return true;
};

let Acquisition_Completed = (objInfo) => {
    let dataPDFsupport = isDataPdfEnabled();
    if (!dataPDFsupport && objInfo.NumAccepted == 0) {
        alert("The selected file is a Non-Raster / Data PDF or it might not be supported.");
    }
    console.log(objInfo);
};

let Acquired_Image = (objInfo, objImage, Accept) => {
    console.log(objInfo)
};

let Annotation_Drawn = async function (objImage, Kind, Left, Top, Right, Bottom) {
    if (Kind == 2) {
        var Angle;
        var IntAngle;

        Angle = Math.atan((Bottom - Top) / (Right - Left));
        Angle = Angle * parseFloat(180) / parseFloat(22 / 7);
        IntAngle = parseInt(Angle * 100) / 100 * -1;

        if (IntAngle < 0) {
            IntAngle = IntAngle + 360;
        }
    }
    await ProcessAfterCallback(Left, Top, Right, Bottom, IntAngle);
    return true;
};

// sample function to showcase all functionalities.
let HaveScanAppEvent = async (Appevent, subevent) => {
    var retval;
    var NewPage;
    var SrcPage;

    showAndSetImageInfo(0);
    showAndGetFileInfo(0);
    var currindex = QuickCaptureInterface.CurrentIndex();

    switch (Appevent) {
        case "append":
            await QuickCaptureInterface.AppendFromScanner();
            break;
        case "insertafter":
            await QuickCaptureInterface.InsertAfterFromScanner();
            break;
        case "insertbefore":
            await QuickCaptureInterface.InsertBeforeFromScanner();
            break;
        case "replace":
            await QuickCaptureInterface.ReplacePageFromScanner();
            break;
        case "selectscanner":
            retval = await QuickCaptureInterface.SelectSource('a');
            if (retval == true) {
                let DriverName = QuickCaptureInterface.Twain.Device;
                alert(DriverName + " Scanner is selected");
            }
            break;
        case "appendfromfile":
            QuickCaptureInterface.Control.AttachDisplayOrder = "firstpage";
            retval = await QuickCaptureInterface.AppendFromFile();
            if (!retval)
                return;
            break;

        case "replacecurrentpage":
            retval = await QuickCaptureInterface.InsertAtCurrentPage();
            if (!retval)
                return;
            break;
        case "insertaftercurrentpage":
            retval = await QuickCaptureInterface.InsertAfterCurrentPage();
            if (!retval)
                return;
            break;

        case "insertbeforecurrentpage":
            retval = await QuickCaptureInterface.InsertBeforeCurrentPage();
            if (!retval)
                return;
            break;

        case "appendfromfolder":
            QuickCaptureInterface.Control.AttachDisplayOrder = "firstpage";
            retval = QuickCaptureInterface.AppendFromFolder();
            QuickCaptureInterface.LimitPageRange(0, 0);
            if (!retval)
                return;
            break;

        case "firstpage":
            QuickCaptureInterface.NavigateToPage("firstpage", 1);
            ShowPageInfo();
            break;
        case "prevpage":
            QuickCaptureInterface.NavigateToPage("prevpage", 1);
            ShowPageInfo();
            break;
        case "nextpage":
            QuickCaptureInterface.NavigateToPage("nextpage", 1);
            ShowPageInfo();
            break;
        case "lastpage":
            QuickCaptureInterface.NavigateToPage("lastpage", 1);
            ShowPageInfo();
            break;
        case "gotopage":
            AskPageNumber();
            menuoption = "gotopage";
            break;
        case "discard":
            QuickCaptureInterface.DiscardPage();
            if (currindex == QuickCaptureInterface.TotalPageCount() + 1)
                QuickCaptureInterface.NavigateToPage("gotopage", currindex - 1);
            else
                QuickCaptureInterface.NavigateToPage("gotopage", currindex);

            QuickCaptureInterface.LimitPageRange(0, 0);
            ShowPageInfo();
            break;
        case "discardall":
            QuickCaptureInterface.ClearLibrary();
            QuickCaptureInterface.ClearContents();
            QuickCaptureInterface.LimitPageRange(0, 0);
            ShowPageInfo();
            break;
        case "movetopage":
            menuoption = "movetopage";
            SrcPage = QuickCaptureInterface.CurrentIndex();
            NewPage = prompt("Enter destination page number");
            if (NewPage <= 0) return;
            QuickCaptureInterface.MoveToPage(SrcPage, NewPage, 1);
            break;
        case "movetoend":
            SrcPage = QuickCaptureInterface.CurrentIndex();
            NewPage = QuickCaptureInterface.TotalPageCount();
            QuickCaptureInterface.MoveToPage(SrcPage, NewPage, 1);
            ShowPageInfo();
            break;

        case "rotate":
            let rangle = 90;
            await QuickCaptureInterface.Rotate(rangle);
            break;

        case "cropopenimage":
            Operation = "cropopenimage";
            QuickCaptureInterface.DrawAnnotation(1);
            break;

        case "extract":
            Operation = "extract";
            QuickCaptureInterface.DrawAnnotation(1);
            break;

        case "textannotate":
            Operation = "textannotate";
            QuickCaptureInterface.DrawAnnotation(1);
            break;

        case "imagestamping":
            DoImageStamping();
            break;

        case "saveoutput":
            SaveOutputFile();
            break;

        case "filenamesize":
            ShowFileNameSize();
            break;

        case "currentpgbpp":
            currentPageBpp();
            break;

        case "fillcolor":
            Operation = "fillcolor";
            QuickCaptureInterface.DrawAnnotation(1);
            break;
        case "fillcoloroutside":
            Operation = "fillcoloroutside";
            QuickCaptureInterface.DrawAnnotation(1);
            break;

        case "manualdeskew":
            Operation = "manualdeskew";
            QuickCaptureInterface.DrawAnnotation(2);
            break;

        case "autodeskew":
            QuickCaptureInterface.DeskewPage(ScanConfig.MaxDeskewAngle);
            break;

        case "autodespeckle":
            QuickCaptureInterface.DespecklePage(ScanConfig.DespeckleQuality, 1);
            break;

        case "invertimage":
            QuickCaptureInterface.InvertPage();
            break;

        case "blackandwhite":
            QuickCaptureInterface.SetForBlackandWhite();
            break;

        case "grayimage":
            QuickCaptureInterface.SetForGray();
            break;

        case "removehorizontallines":
            QuickCaptureInterface.RemoveLines(ScanConfig.MinLength, ScanConfig.MaxThickness, 1, false);
            break;

        case "removeverticallines":
            QuickCaptureInterface.RemoveLines(ScanConfig.MinLength, ScanConfig.MaxThickness, 2, false);
            break;

        case "removebothlines":
            QuickCaptureInterface.RemoveLines(ScanConfig.MinLength, ScanConfig.MaxThickness, 3, false);
            break;

        case "setpageattr":
            setPageAttribute();
            break;

        case "getpageattr":
            getPageAttribute();
            break;

        case "imageenhance":
            ImageEnhance(subevent);
            break;

        case "print":
            QuickCaptureInterface.PrintPage();
            break;

        case "zoommouse":
            QuickCaptureInterface.SetMouseTool(1);
            break;

        case "panmouse":
            QuickCaptureInterface.SetMouseTool(2);
            break;

        case "maginifier":
            QuickCaptureInterface.SetMouseTool(3);
            break;

        case "resetmousetool":
            QuickCaptureInterface.ResetMouseTool();
            break;

        case "downloadinstaller":
            QuickCaptureInterface.DownloadInstaller();
            break;

        case "triggerservice":
            checkAppInstalled();
            break;

        case "licenseinfo":
            getServiceInfo();
            break;

        case "zoomfactor":
            AskforZoomInput();
            break;

        case "currentimageinfo":
            showAndSetImageInfo(1);
            break;

        case "allfileinfo":
            showAndGetFileInfo(1, -1);
            break;

        default:
            break;
    }
    QuickCaptureInterface.SetViewerFocus();
};

let ImageEnhance = (type) => {
    switch (type) {
        case "brightness":
            let bInput;
            bInput = prompt("Please enter a number between -50 and +50:");
            if (bInput === null) {
                break;
            }
            const bvalue = parseFloat(bInput);
            if (!isNaN(bvalue) && bvalue >= -50 && bvalue <= 50) {
                QuickCaptureInterface.setBrightness(bvalue);
            } else {
                alert("Invalid input. Please enter a value between -50 and +50.");
            }
            break;
        case "contrast":
            let cInput;
            cInput = prompt("Please enter a number between -50 and +50:");
            if (cInput === null) {
                break;
            }
            const cvalue = parseFloat(cInput);
            if (!isNaN(cvalue) && cvalue >= -50 && cvalue <= 50) {
                QuickCaptureInterface.setContrast(cvalue);
            } else {
                alert("Invalid input. Please enter a value between -50 and +50.");
            }
            break;
        case "smoothing":
            let sInput;
            sInput = prompt("Please enter a number between 0 and +50:");
            if (sInput === null) {
                break;
            }
            const svalue = parseFloat(sInput);
            if (!isNaN(svalue) && svalue >= 0 && svalue <= 50) {
                QuickCaptureInterface.setSmoothing(svalue);
            } else {
                alert("Invalid input. Please enter a value between 0 and +50.");
            }
            break;
        case "dilate":
            QuickCaptureInterface.Dilate();
            break;
        case "erode":
            QuickCaptureInterface.Erode();
            break;
        case "sharpen":
            QuickCaptureInterface.Sharpen();
            break;
        case "removeborder":
            QuickCaptureInterface.RemoveBorder(ScanConfig.minwidth, ScanConfig.minheight);
            break;
        default:
            break;
    }
    return true;
};

let DeskewPage = async () => {
    await QuickCaptureInterface.DeskewPage(45);
};

let SaveOutputFile = async () => {
    var V = QuickCaptureInterface.Viewer;
    if (V.Contents.NumPages < 1) {
        alert("Add atleast 1 page to viewer");
        return;
    }
    var Out = QuickCaptureInterface.GetNewOutputObj("output_tif_file");
    QuickCaptureInterface.AddToOutputObj(Out);

    var s = await Out.FileSize();
    console.log("Filesize -" + s);
    var ret = await QuickCaptureInterface.CopyOutput(Out, "output_tif_file.tif");
    if (ret) {
        if (ret.status == "success") {
            console.log("Files saved at -" + ret.filename);
        }
        else {
            if (ret.description == "no filename selected") {
                alert("No folder Selected");
                return;
            } else {
                alert("Saving of output failed Error - " + ret.error);
                return;
            }
        }
    }
};

let DoImageStamping = async function () {
    var V = QuickCaptureInterface.Viewer;
    if (V.Contents.NumPages < 1) {
        alert("Add atleast 1 page to viewer");
        return;
    }

    var StampingConfig = {
        "STAMPING_CONFIG": {
            "TWAIN": {
                "Source Application Name": true,
                "Date": true,
                "Time": true,
                "User Info": true,
                "IP Address": true,
                "Mac Address": true
            },
            "USER_INFO": {
                "UserName": "devsupport@extrieve.com",
                "UserId": "EXTRIEVE"
            },
            "Enabled": true,
            "Delimiter": "|",
            "Name": "TWAIN VIEWER"
        }
    };

    var Out = QuickCaptureInterface.GetNewOutputObj("stamping_output");
    QuickCaptureInterface.initStamping(StampingConfig.STAMPING_CONFIG, StampingConfig.STAMPING_CONFIG.TWAIN, StampingConfig.STAMPING_CONFIG.USER_INFO);
    var stamp = QuickCaptureInterface.getStampingObject(0.04, -0.05);
    QuickCaptureInterface.AddToOutputObj(Out);
    Out.SetStampingInfo(stamp);

    var s = await Out.FileSize();
    var ret = await QuickCaptureInterface.CopyOutput(Out, "stamped_output.tif");
    if (ret) {
        if (ret.status == "success") {
            alert("Compressed Filesize For Stamped Document - " + s + " bytes\nFiles saved at -" + ret.filename);
        }
        else {
            if (ret.description == "no filename selected") {
                alert("No folder selected by user");
            } else {
                alert("Error in saving output - " + ret.error);
            }
        }
    }
    return;
};

let ShowFileNameSize = async function () {
    var V = QuickCaptureInterface.Viewer;
    if (V.Contents.NumPages < 1) {
        alert("Add atleast 1 page to viewer");
        return;
    }
    var Out = QuickCaptureInterface.GetNewOutputObj("output_tif_file");
    QuickCaptureInterface.AddToOutputObj(Out);
    var s = await Out.FileSize();
    alert("Output file blob: \n" + Out.mFileName + "\nOutput file size: " + Out.mFileSize + " bytes or " + Math.round(Out.mFileSize / 1024, 2) + " kb");
};

let CropAndAppendImage = async () => {
    await QuickCaptureInterface.CropAndAppedImage(10, 10, 100, 100);
};

let UploadImage = async () => {
    let V = QuickCaptureInterface.Viewer;
    if (V.Contents.NumPages <= 1) {
        alert("Add 2 pages to Viewer before start testing");
        return;
    }

    let uploadUrl = "https://eo6lbhayb3d8qk8.m.pipedream.net";
    let requestData = { name: 'data', data: JSON.stringify({ uid: 123456, imagepool: "A", timestamp: 1645123545 }) };
    let headerData = { "x-quickcapture-token": "1sdGFH5k4KUJH45JKjf4KGHsK54JHsf54" };
    let useServiceToUpload = true;
    let httpMode = "post";

    var Out = QuickCaptureInterface.GetNewOutputObj("upload_file");
    QuickCaptureInterface.AddToOutputObj(Out);
    let upRes = await QuickCaptureInterface.uploadFiles(Out, httpMode, uploadUrl, requestData, headerData, useServiceToUpload);
    if (useServiceToUpload) {
        upRes ? alert("Image upload success\nImage Id: " + imageid) : alert("Image upload failed");
    } else {
        upRes ? alert("Image upload success\nImage Id: " + upRes.IMAGEID) : alert("Image upload failed");
    }
    location.reload();
};

let DownloadToViewer = async (directImageOrFileDownload, pdf) => {
    // demo link to test data and image pdf and image from link
    let dPdf = "https://lime-oona-71.tiiny.site/image-2024-06-21T07-06-48.399Z.pdf";
    let iPdf = "https://orange-ethelyn-45.tiiny.site/30page1.pdf";
    let jpgImg = "https://content.presentermedia.com/files/clipart/00023000/23696/file_document_folder_800_wht.jpg";
    let downloadurl = pdf ? iPdf : jpgImg;
    /*
    directImageOrFileDownload: false to check download via server, true to direct download from link
    */
    if (directImageOrFileDownload) {
        QuickCaptureInterface.Library.SetCurrentAppID("-1");
        QuickCaptureInterface.Viewer.Contents.Add(downloadurl, "", 1, 1, "-1");
        QuickCaptureInterface.LimitPageRange(0, 0);
        QuickCaptureInterface.NavigateToPage("firstpage");
    } else {
        let headerData = { "x-quickcapture-token": "1sdGFH5k4KUJH45JKjf4KGHsK54JHsf54" };
        let useServiceToDownload = true;
        let httpMode = "get";
        let requestData = "";
        QuickCaptureInterface.Library.SetCurrentAppID("-1");
        let downRes = await QuickCaptureInterface.downloadFiles(downloadurl, httpMode, requestData, headerData, useServiceToDownload);
        if (downRes.status == "success") {
            console.log("Downloaded file to viewer", downRes);
        } else {
            console.log("Download failed", downRes);
        }
    }
};

let loadNewViewerInstance = () => {
    let currentviewerElem = document.getElementById("ImgViewerRoot");
    currentviewerElem.style.width = "50%";
    currentviewerElem.style.display = "flex";
    currentviewerElem.style.float = "left";
    let currentviewerElem2 = document.getElementById("ImgViewerRoot2");
    currentviewerElem2.style.display = "flex";
    currentviewerElem2.style.width = "50%";
    initViewerInstance();
};

let setViewerZoomFactorwithZoom = (type) => {
    switch (type) {
        case "0":
            QuickCaptureInterface.SetZoomFactorWithZoom(0);
            break;
        case "50":
            QuickCaptureInterface.SetZoomFactorWithZoom(50);
            break;
        case "100":
            QuickCaptureInterface.SetZoomFactorWithZoom(100);
            break;
        case "150":
            QuickCaptureInterface.SetZoomFactorWithZoom(150);
            break;
        case "200":
            QuickCaptureInterface.SetZoomFactorWithZoom(200);
            break;
        case "300":
            QuickCaptureInterface.SetZoomFactorWithZoom(300);
            break;
        default:
            break;
    }
};

let AskforZoomInput = () => {
    var e = document.getElementById("zoominput");
    e.style.display = 'block';
};

let CloseZoomInput = async (arg) => {
    var e = document.getElementById("zoominput");
    e.style.display = 'none';

    if (arg == 0) {
        QuickCaptureInterface.SetDisplayOption("fitwidth");
        return;
    }

    if (document.zoomuInput.zoomvals[0].checked)
        setViewerZoomFactorwithZoom("0");
    else if (document.zoomuInput.zoomvals[1].checked)
        setViewerZoomFactorwithZoom("50");
    else if (document.zoomuInput.zoomvals[2].checked)
        setViewerZoomFactorwithZoom("100");
    else if (document.zoomuInput.zoomvals[3].checked)
        setViewerZoomFactorwithZoom("150");
    else if (document.zoomuInput.zoomvals[4].checked)
        setViewerZoomFactorwithZoom("200");
    else if (document.zoomuInput.zoomvals[5].checked)
        setViewerZoomFactorwithZoom("300");
};

let AskforUserInput = () => {
    var e = document.getElementById("uinput");
    e.style.display = 'block';
};

let CloseUserInput = async (arg) => {
    var e = document.getElementById("uinput");
    e.style.display = 'none';

    if (arg == 0) return;

    if (document.formuInput.optvals[0].checked)
        await QuickCaptureInterface.DoExtract(ExtLeft, ExtTop, ExtRight, ExtBottom, 'append');
    else if (document.formuInput.optvals[1].checked)
        await QuickCaptureInterface.DoExtract(ExtLeft, ExtTop, ExtRight, ExtBottom, 'insertbefore');
    else if (document.formuInput.optvals[2].checked)
        await QuickCaptureInterface.DoExtract(ExtLeft, ExtTop, ExtRight, ExtBottom, 'insertafter');
    else if (document.formuInput.optvals[3].checked) {
        await QuickCaptureInterface.DoExtract(ExtLeft, ExtTop, ExtRight, ExtBottom, 'overwrite');
        QuickCaptureInterface.SetDisplayOption("fitpage");
    }
    QuickCaptureInterface.LimitPageRange(0, 0);
    QuickCaptureInterface.refreshNav();
};

let AskAnnotateValue = () => {
    var e = document.getElementById("textannotati");
    e.style.display = 'block';
    document.getElementById("textannotatvali").value = "";
    document.getElementById("textannotatvali").focus();
};

let closeTextAnnotate = async (arg) => {
    var Msg = document.getElementById("textannotatvali").value;
    if (arg === 1) {
        if (Msg.length === 0) {
            alert("Please enter the value to save in image.");
            return false;
        }
    }
    var e = document.getElementById("textannotati");
    e.style.display = 'none';

    if (!arg && arg == 0) return;
    var vObj = QuickCaptureInterface;
    vObj.TextAnnotate(ExtLeft, ExtTop, ExtRight, ExtBottom, Msg);
    QuickCaptureInterface.refreshNav();
};

let ShowPageInfo = () => {
    let total = document.getElementById("txtpageTotalht");
    let current = document.getElementById("txtpage");
    current.value = QuickCaptureInterface.CurrentIndex();
    total.innerText = "/ " + QuickCaptureInterface.TotalPageCount();
};

let checkForTextLength = () => {
    var e = event.srcElement || event.tragetElement;
    if (!e) {
        return;
    }
    if (e.value.length > 20) {
        return false;
    }
};

let ProcessAfterCallback = async (Left, Top, Right, Bottom, Angle) => {
    if (Operation == "") return;

    switch (Operation) {
        case "extract":
            AskforUserInput();
            ExtLeft = Left;
            ExtTop = Top;
            ExtRight = Right;
            ExtBottom = Bottom;
            break;

        case "manualdeskew":
            QuickCaptureInterface.RotateFine(Angle);
            break;

        case "fillcolor":
            QuickCaptureInterface.DoWhiteOut(Left, Top, Right, Bottom);
            break;

        case "fillcoloroutside":
            QuickCaptureInterface.DoBorderWhiteOut(Left, Top, Right, Bottom);
            break;

        case "textannotate":
            AskAnnotateValue();
            ExtLeft = Left;
            ExtTop = Top;
            ExtRight = Right;
            ExtBottom = Bottom;
            break;
        case "cropopenimage":
            let image = await QuickCaptureInterface.GetCroppedImage(Left, Top, Right, Bottom);
            if (!image) return;
            window.open(image, '_blank');
            break;
    }
    Operation = "";
};

let currentPageBpp = async () => {
    if (QuickCaptureInterface.TotalPageCount() == 0) return;
    let bpp = await QuickCaptureInterface.getCurrentPgBPP();
    alert("Current page bit per pixel: " + bpp);
};

let showAndSetImageInfo = async (type) => {
    let mainElement = document.getElementById("imginfocontent");
    let haveImage = QuickCaptureInterface.Viewer.Image;
    if (type && haveImage) {
        mainElement.style.display = "block";
        let tableElementHeader = document.getElementById("setimageinfoheader");
        let htmlContent = '<th>Page</th><th>Width</th><th>Height</th><th>Size in bytes</th><th>Size in mb</th><th>BitsPerPixel</th><th>BlackPerCent</th><th>XResolution</th><th>YResolution</th>';
        tableElementHeader.innerHTML = htmlContent;
        let tableElementBody = document.getElementById("setimageinfodata");
        if (QuickCaptureInterface && QuickCaptureInterface.Viewer && QuickCaptureInterface.Viewer.Image) {
            let imgInfo = await QuickCaptureInterface.GetImageInfo(QuickCaptureInterface.Viewer.Image.Internal1);
            let bodyContent = '<td>' + QuickCaptureInterface.Viewer.Image.Internal1 + '</td><td>' + imgInfo.width + '</td><td>' + imgInfo.length + '</td><td>' + imgInfo.imagedata_size + '</td><td>' + ((imgInfo.imagedata_size / 1024) / 1024).toFixed(2) + '</td><td>' + imgInfo.bits_per_sample + '</td><td>' + imgInfo.blackpercent + '</td><td>' + imgInfo.xresolution + '</td><td>' + imgInfo.yresolution + '</td>';
            tableElementBody.innerHTML = bodyContent;
            document.getElementById("fileinfocontent").style.display = 'none';
        }
    } else {
        mainElement.style.display = "none";
    }
};

let showAndGetFileInfo = async (type, index) => {
    let mainElement = document.getElementById("fileinfocontent");
    let haveImage = QuickCaptureInterface.Viewer.Image;
    if (type && haveImage) {
        mainElement.style.display = "block";
        let tableElementHeader = document.getElementById("setfileinfoheader");
        let htmlContent = '<th>File Index</th><th>Local File Uri</th><th>Page count</th><th>Size in bytes</th><th>Size in mb</th>';
        tableElementHeader.innerHTML = htmlContent;
        let tableElementBody = document.getElementById("setfileinfodata");
        if (QuickCaptureInterface && QuickCaptureInterface.Viewer && QuickCaptureInterface.Viewer.Image) {
            let fileInfo = await QuickCaptureInterface.GetFileInfo(index);
            fileInfo = fileInfo.filenames ? fileInfo.filenames : [fileInfo];
            let bodyContent = '';
            for (let fi = 0; fi < fileInfo.length; fi++) {
                let findex = fileInfo[fi].fileindex ? fileInfo[fi].fileindex.toString() : index;
                bodyContent += '<tr><td>' + findex + '</td><td>' + fileInfo[fi].filename + '</td><td>' + fileInfo[fi].imagecount + '</td><td>' + fileInfo[fi].filesize + '</td><td>' + ((fileInfo[fi].filesize / 1024) / 1024).toFixed(2) + '</td></tr>';
            }
            tableElementBody.innerHTML = bodyContent;
            document.getElementById("imginfocontent").style.display = 'none';
        }
    } else {
        mainElement.style.display = "none";
    }
};

let setPageAttribute = () => {
    let Tcount = QuickCaptureInterface.TotalPageCount();
    if (Tcount <= 0) return;
    let page = prompt("Enter page number to set attribute");
    if (page <= 0) return;
    let attr = prompt("Enter attribute to set in given page number");
    if (!attr) return;
    QuickCaptureInterface.SetPageAttribute(attr, page);
    alert("Attribute added to page number: " + page);
};

let getPageAttribute = () => {
    let Tcount = QuickCaptureInterface.TotalPageCount();
    if (Tcount <= 0) return;
    let page = prompt("Enter page number to get attribute");
    if (page <= 0) return;
    let attr = QuickCaptureInterface.GetPageAttribute(page);
    alert("Page Number: " + page + "\nAtrribute: " + attr);
};

let getServiceInfo = async () => {
    function checkLicenseSupport(data) {
        const start = data.demo_licence_start;
        const end = data.demo_licence_end;
        const licensed = data.add_ons_licenced;
        const available = data.add_ons_available;
        const pdfwizSupported = licensed.pdfwiz && available.pdfwiz;
        const pstillSupported = licensed.pstill && available.pstill;
        const licenseSupport = ["IMAGES"];

        if (pdfwizSupported) {
            licenseSupport.push('DATA PDF');
        }
        if (pstillSupported) {
            licenseSupport.push('IMAGE PDF');
        }
        return `Demo Licence Valid From: ${start}\nDemo Licence Valid Till: ${end}\nLicense Support for: ${licenseSupport.join(', ') || 'None'}`;
    }
    let twainInfoLocal = localStorage.getItem("TWAIN_RESERVE_INFO");
    let obj;
    try {
        obj = JSON.parse(twainInfoLocal);
    } catch (e) {
        obj = null;
    }
    if (!twainInfoLocal || !obj) {
        alert(await QuickCaptureInterface.getServiceInfo());
    } else {
        alert(checkLicenseSupport(obj));
    }
};

let checkAppInstalled = () => {
    QuickCaptureInterface.triggerHttpTwain();
};

let isDataPdfEnabled = () => {
    let twainInfo = null;
    let twainInfoLocal = localStorage.getItem("TWAIN_RESERVE_INFO");
    if (!twainInfoLocal) return false;
    try {
        twainInfo = JSON.parse(twainInfoLocal);
    } catch (error) {
        return false;
    }
    if (twainInfo.add_ons_available && twainInfo.add_ons_available.pstill) {
        if (twainInfo.add_ons_licenced && twainInfo.add_ons_licenced.pstill) {
            console.log("Data pdf support:", true);
            return true;
        }
    }
    console.log("Data pdf support:", false);
    return false;
};
//#endregion

(async () => {
    initScannerViewer();
})();