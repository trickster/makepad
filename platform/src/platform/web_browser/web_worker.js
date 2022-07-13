import {WasmBridge} from "/makepad/platform/wasm_bridge/src/wasm_bridge.js"

class WasmWorker extends WasmBridge {
    constructor(wasm) {
        super (wasm);
    }
}

onmessage = async function(e) {
    let data = e.data;
    let wasm = await WasmBridge.instantiate_wasm(data.bytes, data.memory, {
        _post_signal(signal_hi, signal_lo) {
            postMessage({signal_hi, signal_lo});
        }
    });
    wasm.instance.exports.__stack_pointer.value = data.stack_ptr;
    wasm.instance.exports.__wasm_init_tls(data.tls_ptr);
    wasm.instance.exports.wasm_thread_entrypoint(data.closure_ptr);
    
    let bridge = new WasmWorker(wasm);
}