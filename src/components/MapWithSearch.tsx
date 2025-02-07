import { FC, useEffect, useState } from "react"       
                                              import { useTranslation } from "react-i18next";;

import CustomNeshanMap from "./CustomNeshanMap";
import useMapController from "./hooks/useMapController";
import useAddressToLocation from "./hooks/useAddressToLocation";

interface IProps {
  onSelectLocation: (lat: number, lng: number) => void;
  center?: [number, number];
}

const MapWithSearch: FC<IProps> = ({ onSelectLocation, center }) => {
  const { mapReceiver, mapMovement } = useMapController();
  const { result, search, fetching } = useAddressToLocation();
  const [inputText, setInputText] = useState<string>("");
  //   const native = useNative();

  const searchHandler = () => {
    search(inputText);
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      searchHandler();
    }, 1000);
    return () => {
      clearTimeout(timeOut);
    };
  }, [inputText]);

  const clearInput = () => {
    setInputText("");
  };

  const selectSearchedItem = (selectedLat: number, selectedLng: number) => {
    mapMovement(selectedLat, selectedLng);
    clearInput();
    onSelectLocation(selectedLat, selectedLng);
  };

  //   useEffect(() => {
  //     native.getLocation(selectSearchedItem);
  //   }, []);

  return (
    <section className="relative">
      <div className="flex justify-between items-center bg-light-A dark:bg-dark-D rounded-2xl absolute -top-12 z-10 w-full">
        <div className="grow">
          <input
            onChange={(val) => setInputText(val)}
            value={inputText}
            onSubmit={searchHandler}
          />

          <section>
            {inputText.trim().length > 0 && (
              <div>
                {fetching ? (
                  <div className="h-10">loading</div>
                ) : (
                  <>
                    {result?.items.slice(0, 7).map((item, index, arr) => (
                      <div
                        onClick={() => {
                          selectSearchedItem(item.location.y, item.location.x);
                        }}
                        className="p-2 mx-4"
                        key={item.id}
                      >
                        <h1>{item.title}</h1>
                        <h2 className="tBody text-xs">
                          {item.region} {item.address}
                        </h2>
                        {arr.length !== index + 1 && (
                          <hr className="opacity-40 mt-2" />
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </section>
        </div>
        {inputText.length > 0 &&
          // <RoundedButton
          //   type="square"
          //   content={<Close />}
          //   className="sm:h-20 sm:w-24 sm:text-xl mr-3 sm:mr-7 top-2 absolute left-0 bg-light-A dark:bg-dark-D"
          //   onClick={clearInput}
          // />
          ""}
      </div>
      <div className="mt-10">
        <div className="text-center tBody text-sm">
          لطفا موقعیت دقیق خود را روی نقشه مشخص کنید.
        </div>
        <CustomNeshanMap
          center={center}
          actionHandler={onSelectLocation}
          thisMap={mapReceiver}
        />
      </div>
    </section>
  );
};

export default MapWithSearch;
