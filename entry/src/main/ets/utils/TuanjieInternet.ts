import network from '@system.network';

enum NetworkReachability {
  None = -1,
  NotReachable,
  ReachableViaCarrierDataNetwork,
  ReachableViaLocalAreaNetwork
}
  
export class TuanjieInternet {

  static internetState = NetworkReachability.None;

  static Subscribe() {
    network.subscribe({
      success: function(data) {
        console.log('network type change type:' + data.type);
        if (data.metered) {
          TuanjieInternet.internetState = NetworkReachability.ReachableViaCarrierDataNetwork;
        }
        else if (data.type == "WiFi") {
          TuanjieInternet.internetState = NetworkReachability.ReachableViaLocalAreaNetwork;
        }
        else {
          TuanjieInternet.internetState = NetworkReachability.NotReachable;
        }
      },
      fail: function(data, code) {
        console.log('fail to subscribe network, code:' + code + ', data:' + data);
      },
    });
  }

  static GetInternetReachability() {
    if (TuanjieInternet.internetState == NetworkReachability.None) {
      //TuanjieInternet.Subscribe();
      return NetworkReachability.NotReachable;
    }
    else {
      return TuanjieInternet.internetState;
    }
  }
}
