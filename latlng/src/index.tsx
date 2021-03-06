﻿import React, { ChangeEvent } from "react";
import ReactDOM from "react-dom";

import Papa from "papaparse";

import Ajax from "utils/ajax";
import Logging from "utils/logging";

interface LatLngState {
    notFound: string[];
    completed: number;
}

class LatLng extends React.Component<{}, LatLngState> {
    private csvData: any[];
    private startTime: Date;
    private fileName: string;
    private timeDelay: number;
    private addressIndex: number;
    private cityIndex: number;
    private stateIndex: number;
    private zipIndex: number;
    private latIndex: number;
    private lngIndex: number;

    constructor(props: {}) {
        super(props);

        this.state = {
            notFound: [],
            completed: 0,
        };

        this.timeDelay = 50;
        this.addressIndex = -1;
        this.cityIndex = -1;
        this.stateIndex = -1;
        this.zipIndex = -1;
        this.latIndex = -1;
        this.lngIndex = -1;
        this.csvData = [];
        this.startTime = new Date();
        this.fileName = "";
    }

    public render(): React.ReactFragment {

        let progress: JSX.Element = <span />;

        // Subtract 1 from the length, to account for the header line.
        if (undefined !== this.csvData) {
            const eta: Date = new Date();
            eta.setTime(eta.getTime() + (this.csvData.length - 1 - this.state.completed) * this.timeDelay);
            const countDown: Date = new Date(eta.getTime() - new Date().getTime());

            progress = (
                <React.Fragment>
                    <div className="col-sm-8 mx-auto mb-2">
                        Progress: {this.state.completed}/{this.csvData.length - 1}
                    </div>
                    <div className="col-sm-8 mx-auto mb-5">
                        Countdown: {countDown.getMinutes()}:{countDown.getSeconds()}
                    </div>
                </React.Fragment>
            );
        }

        const notFound: JSX.Element[] = this.state.notFound.map((value: string, index: number) => {
            return (<div key={index}>{value}</div>);
        });

        return (
            <React.Fragment>
                <div id="mainText" className="col-sm-8 mx-auto mb-5">
                    Upload a CSV file with a field called "Address", to retreive the latitude and longitude of all the addresses. Addresses that can't be found will be listed below.
                </div>
                <div className="col-sm-8 mx-auto mb-3">
                    <input type="file" accept="*.csv" onChange={this.onUpload} />
                </div>
                {progress}
                <div className="col-sm-8 mx-auto">
                    {notFound}
                </div>
            </React.Fragment>
        );
    }

    protected onUpload = (event: ChangeEvent<HTMLInputElement>): void => {
        if (null !== event.target.files && null !== event.target.files[0]) {
            this.startTime = new Date();
            this.fileName = event.target.files[0].name;
            Papa.parse(event.target.files[0], {
                complete: this.onParseComplete,
            });
        }
    }

    protected onParseComplete = (results: Papa.ParseResult) => {
        if (null !== results.data && 0 < results.data.length) {
            // Identify which index holds the address.
            for (const data of results.data[0]) {
                if (-1 < (data as string).toLowerCase().indexOf("address")) {
                    this.addressIndex = results.data[0].indexOf(data);
                }
                if (-1 < (data as string).toLowerCase().indexOf("city")) {
                    this.cityIndex = results.data[0].indexOf(data);
                }
                if (-1 < (data as string).toLowerCase().indexOf("state")) {
                    this.stateIndex = results.data[0].indexOf(data);
                }
                if (-1 < (data as string).toLowerCase().indexOf("zip")) {
                    this.zipIndex = results.data[0].indexOf(data);
                }
            }

            this.latIndex = (results.data[0] as any).length;
            this.lngIndex = this.latIndex + 1;
            results.data[0][this.latIndex] = "Latitude";
            results.data[0][this.lngIndex] = "Longitude";

            this.csvData = results.data;

            setTimeout(this.getLocation, this.timeDelay);
        }
    }

    private getLocation = (currentIndex: number = 1): void => {
        this.csvData[currentIndex][this.addressIndex] += ", " + this.csvData[currentIndex][this.cityIndex] + ", " + this.csvData[currentIndex][this.stateIndex] + " " + this.csvData[currentIndex][this.zipIndex];
        const address: string = this.csvData[currentIndex][this.addressIndex];
        Ajax.get("api/geocode?address=" + address + ", " + this.csvData[currentIndex][this.cityIndex])
            .then((result: JsonResult) => {
                const status: google.maps.GeocoderStatus = result.data.status;
                const geocodeResults: google.maps.GeocoderResult[] = result.data.results;
                Logging.log("STATUS: %s", status);
                if (status === google.maps.GeocoderStatus.REQUEST_DENIED) {
                    Logging.log("STOPPING.");
                    return;
                } else if (status === google.maps.GeocoderStatus.OK) {
                    this.csvData[currentIndex][this.lngIndex] = geocodeResults[0].geometry.location.lng;
                    this.csvData[currentIndex][this.latIndex] = geocodeResults[0].geometry.location.lat;
                    this.setState({ completed: currentIndex });
                } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
                    this.csvData[currentIndex][this.latIndex] = 0;
                    this.csvData[currentIndex][this.lngIndex] = 0;
                    this.state.notFound.push(this.csvData[currentIndex][this.addressIndex]);
                    this.setState({ completed: currentIndex, notFound: this.state.notFound });
                } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT || status === google.maps.GeocoderStatus.UNKNOWN_ERROR) {
                    Logging.log("PAUSED");
                    setTimeout(this.getLocation, 50000, this.csvData[currentIndex][this.addressIndex], currentIndex);
                    return;
                }

                currentIndex += 1;

                if (currentIndex >= this.csvData.length - 1) {
                    Logging.log("FINISHED");
                    // Surround strings in quotes, and add line breaks to the end of each row.
                    const data: string = this.csvData.map((value: any[]) => {
                        return value.map((val: string | number) => {
                            if (typeof val === "string") {
                                return "\"" + val + "\"";
                            } else {
                                return val;
                            }
                        }).join(",");
                    }).join("\r\n");

                    const link = document.createElement("a");
                    link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(data);
                    link.innerText = "Click to download.";
                    link.setAttribute("download", this.fileName);

                    const main: HTMLElement | null = document.getElementById("mainText");

                    if (null !== main) {
                        main.appendChild(link);
                    }
                } else {
                    setTimeout(this.getLocation, this.timeDelay, currentIndex);
                }
            });
    }
}

const latlng: HTMLElement | null = document.getElementById("latlng");

if (null !== latlng) {
    ReactDOM.render(
        <LatLng />,
        latlng,
    );
}
