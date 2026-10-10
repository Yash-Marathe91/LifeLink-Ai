// LifeLink AI - Bluetooth LE Mesh & Opportunistic Courier Service (Flutter/Dart)
// Orchestrates 7-hop TTL relaying, deduplication seen-cache, and DTN courier outbox.

import 'dart:async';
import 'dart:math';
import '../models/sos_packet.dart';

class BLEMeshService {
  static const int maxTTL = 7;
  static const int seenCacheMaxEntries = 1000;
  
  // Seen-set LRU cache to prevent broadcast storming
  final Set<String> _seenPacketIds = {};
  
  // Local Courier Outbox for Opportunistic Store-and-Forward ("Spray-and-Wait")
  final Map<String, SOSPacket> _courierOutbox = {};
  
  // Callback when a new unique SOS packet arrives
  Function(SOSPacket packet)? onSOSPacketReceived;
  
  // Callback when an ACK or responder instruction arrives
  Function(String sosId, String message)? onResponderAckReceived;

  BLEMeshService({this.onSOSPacketReceived, this.onResponderAckReceived});

  /// Ingests a packet received over BLE radio
  Future<void> handleIncomingPacket(SOSPacket packet, {required String ingressPeerId}) async {
    // 1. Deduplication Check
    if (_seenPacketIds.contains(packet.sosId)) {
      // Packet already processed or relayed; discard immediately
      return;
    }

    _addToSeenCache(packet.sosId);

    // 2. Deliver to local application layer (so user/first responder sees it)
    onSOSPacketReceived?.call(packet);

    // 3. Decrement TTL and Relay
    if (packet.ttl > 1) {
      final relayedPacket = packet;
      relayedPacket.ttl -= 1;

      // Jitter delay (20 to 180 ms) to suppress radio collisions
      final jitterMs = 20 + Random().nextInt(160);
      await Future.delayed(Duration(milliseconds: jitterMs));

      // Re-broadcast to nearby peers (excluding the peer who sent it to us)
      await _broadcastOverBLE(relayedPacket, excludePeerId: ingressPeerId);
    } else {
      // TTL exhausted; retain in local Courier pool if no gateway encountered
      _courierOutbox[packet.sosId] = packet;
    }
  }

  /// Initiates broadcast of an original SOS created on this device
  Future<void> broadcastLocalSOS(SOSPacket packet) async {
    _addToSeenCache(packet.sosId);
    _courierOutbox[packet.sosId] = packet; // Persist in outbox until confirmed delivered
    await _broadcastOverBLE(packet);
  }

  /// Opportunistic handover to a passing peer ("Data Mule")
  Future<void> performCourierHandover(String peerId) async {
    if (_courierOutbox.isEmpty) return;

    for (final entry in _courierOutbox.entries) {
      final packet = entry.value;
      // Hand over copy with half remaining spray budget
      await _sendDirectToPeer(peerId, packet);
    }
  }

  Future<void> _broadcastOverBLE(SOSPacket packet, {String? excludePeerId}) async {
    // Platform Channel invocation to native Kotlin / Swift BLE GATT advertiser
    // Sends raw packed bytes over BLE Service UUID 0000FFF0-0000-1000-8000-00805F9B34FB
  }

  Future<void> _sendDirectToPeer(String peerId, SOSPacket packet) async {
    // Direct GATT write to peer
  }

  void _addToSeenCache(String id) {
    if (_seenPacketIds.length >= seenCacheMaxEntries) {
      _seenPacketIds.remove(_seenPacketIds.first);
    }
    _seenPacketIds.add(id);
  }
}
