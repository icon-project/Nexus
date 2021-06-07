from iconsdk.icon_service import IconService
from iconsdk.providers.http_provider import HTTPProvider
from iconsdk.wallet.wallet import KeyWallet

icon_service = IconService(HTTPProvider('https://gicon.net.solidwallet.io', 7))

wallet = KeyWallet.create()

print('address: ', wallet.get_address())
print('private key: ', wallet.get_private_key())
