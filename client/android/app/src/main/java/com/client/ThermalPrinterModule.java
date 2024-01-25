package com.client;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.dantsu.escposprinter.EscPosPrinter;
import com.dantsu.escposprinter.connection.bluetooth.BluetoothPrintersConnections;
import com.dantsu.escposprinter.connection.bluetooth.BluetoothConnection;
import com.dantsu.escposprinter.EscPosCharsetEncoding;

public class ThermalPrinterModule extends ReactContextBaseJavaModule {
    ThermalPrinterModule(ReactApplicationContext context) {super (context);}

    @Override
    public String getName() {
        return "ThermalPrinterModule";
    }

    @ReactMethod
    public void print(String text, Promise promise) {
        BluetoothConnection bluetoothPrinter = BluetoothPrintersConnections.selectFirstPaired();
        EscPosCharsetEncoding charset = new EscPosCharsetEncoding("Cp1251", 46);
        if(bluetoothPrinter != null) {
            try {
                EscPosPrinter printer = new EscPosPrinter(bluetoothPrinter, 203, 48f, 32, charset);
                printer.printFormattedText(text);
                promise.resolve("Text printed successfully!");
            } catch (Exception e) {
                promise.reject("Create error:", "Could not print your text :(\n" + e);
            }
        }
        else {
            promise.reject("Create no printer error:", "No printer found! Check if it's on");
        }
    }
}
