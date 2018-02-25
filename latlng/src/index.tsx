import React, { ChangeEvent } from "react";
import ReactDOM from "react-dom";

import Papa from "papaparse";

class LatLng extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    public render(): React.ReactFragment {
        return (
            <React.Fragment>
                <div className="col-sm-8 mx-auto mb-5">
                    put a description in later
                </div>
                <div className="col-sm-8 mx-auto">
                    <input type="file" accept="*.csv" onChange={this.onUpload} />
                </div>
            </React.Fragment>
        );
    }

    protected onUpload = (event: ChangeEvent<HTMLInputElement>): void => {
        if (null !== event.target.files && null !== event.target.files[0]) {
            Papa.parse(event.target.files[0], {
                complete: this.onParseComplete,
            });
        }
    }

    protected onParseComplete = (results: Papa.ParseResult) => {
        let addressIndex: number = -1;
        if (null !== results.data && 0 < results.data.length) {
            // Identify which index holds the address.
            for (const data of results.data[0]) {
                if (-1 < (data as string).toLowerCase().indexOf("address")) {
                    addressIndex = results.data[0].indexOf(data);
                    break;
                }
            }

            // Now geocode all addresses.
        }
    }
}

const latlng: HTMLElement | null = document.getElementById("latlng");

if (null !== latlng) {
    ReactDOM.render(
        <LatLng />,
        latlng,
    );
}
