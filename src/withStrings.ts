import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import Requester from "./request";
import { LANGUAGES } from "./constants";
import { isCn, keys, log } from "./utils";

dotenv.config();

const { DEEPL_API_TOKEN } = process.env;

if (!DEEPL_API_TOKEN) {
  throw Error("No token was specified");
}

const requester = new Requester(DEEPL_API_TOKEN);

import { toStrings, toStructuredString } from "./parser/iosString";

/**
 * with iOS strings
 */

// Only support ZH right now
export const transform = async (strings) => {
  const structureStrings = toStructuredString(strings);
  const translationPromiseQueue = [];

  for (const structure of structureStrings) {
    const { type, value: pairOrValue } = structure;
    log("before translation", structure);

    // @ts-ignore
    if (type === "pair" && isCn(pairOrValue.value)) {
      translationPromiseQueue.push(async () => {
        const response = await requester.translate({
          // @ts-ignore
          text: pairOrValue.value as string,
          from: LANGUAGES.chinese,
          to: LANGUAGES.englishAmerican,
        });
        // @ts-ignore
        structure.value.value = response.translations[0].text;
      });

      // const response = await requester.translate({
      //   // @ts-ignore
      //   text: pairOrValue.value as string,
      //   from: LANGUAGES.chinese,
      //   to: LANGUAGES.englishAmerican,
      // });

      // @ts-ignore
      // structure.value.value = response.translations[0].text;
      // log(structure);
    }
  }

  await Promise.all(translationPromiseQueue);

  return toStrings(structureStrings);
};

(async () => {
  const data = `/*
Localizable.strings
OneKey

Created by xiaoliang on 2020/10/9.
Copyright © 2020 OneKey. All rights reserved..
*/
"With OneKey, you can certainly have it both safe and easy to use" = "Security and Ease of use, we got both.";
"Your assets are only in your hands" = "Your assets, only in your hands.";
"Our server will not store your private key or mnemonic in any way. Both software and hardware are open source and can be used safely" = "Our server will not store your private key or mnemonic in any way. We make our oftware and hardware open source , just use it with confidence.";
"End-to-end encryption" = "End-to-end encryption";
"We use industry-leading encryption technology to store information locally. Only you can decrypt the information, we will not and cannot view, use or sell any of your data" = "We use industry-leading encryption technology to store information locally. Only you can decrypt the information, and we do not and cannot view, use, or sell any of your data.";
"By starting to use, you agree to Onekey's User Agreement and Privacy Policy" = "By starting to use means that you agree to Onekey's 'User Agreement' and 'Privacy Policy'";
"User Agreement" = "User Agreement";
"Privacy policy" = "Privacy Policy";
"Begin to use" = "Getting Started";
"Create a new wallet" = "Create Wallet";
"Create HD Wallet" = "Create Main Wallet";
"Recover HD Wallet" = "Restore";
"Paired hardware wallet" = "连接硬件设备";
"Paired hardware" = "连接硬件";
"Add wallet" = "Add";
"Create account" = "Create";
"Add wallet account" = "Add Account";
"Support BixinKey" = "Support OneKey";
"Recovery by mnemonic" = "With mnemonics phrase";
"Set the password" = "Set Password";
"Only you can unlock your wallet" = "Only you can unlock your wallet";
"Use longer passwords that are more complex and more secure" = "Use long passwords";
"It is used to encrypt your wallet, is simple and easy to remember, and is suitable for most people" = "It is used to encrypt your wallet, is easy to remember, and works for most people";
"We do not store any of your information, so if you forget your password, we will not be able to retrieve it for you" = "We don't store any of your information (Biometric data such as facial recognition and fingerprints are also stored locally in the device), so if you forget your password, we won't be able to retrieve it for you.";
"Enter your password again" = "Enter your password again";
"Don't reveal your password to anyone else" = "Do not give your password to anyone else";
"Complex passwords are relatively more secure, so keep in mind that it's best not to set them the same as your passwords for other sites" = "Complex passwords are relatively more secure, so keep that in mind after you set them, and don't set them the same as your other site passwords";
"Use a short password" = "Use Short Password";
"Tx All" = "All";
"Tx In" = "Transfer In";
"Tx Out" = "Transfer Out";
"Transaction details" = "Transaction Details";
"Wallet Detail" = "账户详情";
"The wallet list" = "Wallet List";
"Create a wallet" = "Create Wallet";
"Set the wallet name" = "Set a name for the wallet";
"Easy for you to identify" = "Easy for you to identify";
"Import a single currency wallet" = "Import a single-currency wallet";
"Select the currency" = "Select Currency";
"Private key import (direct input or scan)" = "Private Key Import (Direct input or sweep code)";
"Mnemonic import" = "Import with mnemonics phrase";
"Keystore import" = "Keystore Import";
"Observe the purse" = "Observation Wallet";
"The private key import" = "Private Key Import";
"Mnemonic import" = "Import with mnemonics phrase";
"Keystore import" = "Keystore Import";
"Observe the purse import" = "Observation Wallet";
"Once imported, the private key is encrypted and stored on your local device for safekeeping. OneKey does not store any private data, nor can it retrieve it for you" = "Once imported, the private key is encrypted and stored on your local device for safekeeping. OneKey does not store any private data and cannot recover it for you.";
"privateimporttips2" = "- Do not easily uninstall the OneKey App\n- Do not give your mnemonic, private key to anyone\n- Do not take screenshots, send the above sensitive information via chat tools.";
"Enter the private key or scan the QR code (case sensitive)" = "Enter the private key or scan its QR code (Note the uppercase and lowercase)";
"Enter the Keystore file password" = "Enter the Keystore file password";
"Copy and paste the contents of the Keystore file, or scan it Keystore QR code import" = "Copy and paste Keystore file contents, or import by scanning Keystore QR code";
"Please enter an address or public key, support xPub, or scan Two-dimensional code import" = "Please enter your address or public key, support xPub, or scan the QR code to import";
"Observing a wallet does not require importing a private key or mnemonic, just an address or public key, which you can use to track daily transactions or to receive notifications of incoming or outgoing money" = "The Observation Wallet does not require the import of private keys or mnemonics, only require address or public keys, which you can use to keep track of daily transactions or receive notifications of incoming and outgoing coins";
"Scan goes to" = "Scan and transfer in";
"The wallet address" = "Wallet Address";
"ok collection" = "Receive";
"Copied" = "Copied";
"If you don't back up your wallet, once you lose your phone, you won't be able to recover your assets. In some extreme cases, the phone manufacturer may have an accident during the system upgrade, causing all your data or App to be lost, with unpredictable consequences if you happen not to have a backup" = "If you don't back up your wallet, you will never be able to get your assets back when you lose your phone. In some extreme cases, a phone manufacturer may accidentally lose all of your data or apps during a system upgrade, which can have unforeseen consequences if you happen to not have a backup";
"The only way to protect your assets is to back them up correctly" = "The only way to protect your assets is to make the right backup";
"Be ready to copy down your mnemonic" = "Be prepared to copy down your mnemonics";
"Once your phone is lost or stolen, you can use mnemonics to recover your entire wallet, take out paper and pen, let's get started" = "In case your phone is lost or stolen, you can use the mnemonic to recover your entire wallet, get out a pen and paper, and let's get started";
"A standalone wallet does not support backing up to a hardware device" = "Standalone wallets do not support backup to hardware devices";
"Ready to star" = "Ready to Begin";
"Backup the purse" = "Backup Wallet";
"Select wallet Type" = "选择账户类型";
"Independent wallet" = "独立账户";
"Independent" = "独立";
"With the HD logo, derived from the wallet root mnemonic (the mnemonic you copied when you first created your wallet), a mnemonic can create an infinite number of wallets in multiple currencies. It can also be used to recover all derived wallets, save time, effort and security, is the core bitcoin protocol BIP44 implementation" = "带有 HD 标识，基于主钱包助记词派生。";
"A separate wallet with a separate private key generated by a local encryption algorithm. You need to re-copy mnemonics, and everything is not Shared with HD Wallet" = "由本地加密算法生成独立私钥，需要重新抄写助记词，一切都不与主钱包共享。";
"transfer" = "Transfer";
"my" = "Mine";
"Confirmation number" = "Confirmations";
"Block height" = "Block Height";
"Transaction no" = "Trade Number";
"Trading hours" = "Trading Hours";
"Miners fee" = "Miners' Fee";
"note" = "Remark";
"The sender" = "Sender";
"The receiving party" = "Receiver";
"All assets" = "All Assets";
"All the equipment" = "All Devices";
"The connection method" = "Connection Method";
"password" = "Password";
"Facial recognition" = "Facial Recognition";
"Fingerprint identification" = "Fingerprint Recognition";
"language" = "Lanuage";
"Monetary unit" = "Currency Unit";
"network" = "Network";
"Transaction Settings (Advanced)" = "Transaction Settings (Advanced）";
"about" = "About";
"assets" = "Assets";
"hardware" = "Hardware";
"security" = "Security";
"System Settings" = "System Settings";
"Privacy policies, usage protocols, and open source software" = "Privacy Policy, Usage Agreement, and Open Source Software.";
"address" = "Address";
"The private key or mnemonic of the wallet is securely stored in the hardware device. If you need to export a mnemonic for a hardware wallet, go to Myhardware-All Devices to find the device you want to export." = "该钱包的私钥或助记词已经妥善的保管在硬件设备中。如果您需要导出硬件设备的助记词，请前往「我的 ➡️ 全部硬件」查找您要导出的设备。";
"All subwallets derived from the ROOT mnemonic of HD wallet can be recovered with the root mnemonic, so there is no need to export mnemonic words for a single wallet. If you want to get the HD purse the root word mnemonic, please go to my assets HD wallet" = "由主钱包助记词派生而来，可以通过主钱包助记词一键恢复其下所有账户。如果你要备份该助记词，请前往我的 → 资产 →主钱包进行操作。";
"Multiple signature" = "Multi-Signature";
"3-5 (Number of initial signatures - total)" = "3-5 (number of initial signatures - total)";
"To delete the wallet" = "删除账户";
"Export mnemonic" = "Export Mnemonic Phrases";
"Export the private key" = "Export Private Key";
"Export the Keystore" = "Export Keystore";

"type" = "Type";
"Hardware wallet" = "硬件设备";
"Dangerous operation" = "Hazardous Operation";

"Set face recognition" = "Set Facial Recognition";
"Set fingerprint identification" = "Set Fingerprint Recognition";
"You can more easily unlock your wallet without having to type in your password every time" = "You can unlock your wallet more easily without having to enter your password each time.";
"Your face, fingerprints and other biological data are stored on this machine, encrypted by the operating system of your phone manufacturer, and we can neither access nor save these data" = "Biometric data such as your face and fingerprints are stored locally, encrypted by your phone's manufacturer's operating system, and are neither accessible to us nor stored by us.";
"Turn on Face recognition" = "Enable Facial Recognition";
"Turn on fingerprint identification" = "Enable Fingerprint Recognition";
"Turn on fingerprint identification" = "Enable Fingerprint Recognition";
"The next time again say" = "Not Now";

"Following system language" = "Follow the system language";
"Chinese (Simplified)" = "Chinese （Simplified)";
"Select the App's display language" = "Select Display Language of App";
"Legal tender units" = "Fiat Currency Unit";
"RMB (CNY)" = "RMB (CNY)";
"Us Dollar (USD)" = "US Dollar (USD)";
"Korean Won (CNY)" = "Korean Won (KMR)";
"More and more" = "More";
"Bitcoin unit" = "Bitcoin Unit";
"Ethereum unit" = "Ethereum Unit";
"Use RBF (trade substitution)" = "Use RBF (Transaction Substitution)";
"Spend unrecognized income" = "Spend unconfirmed input\n ";
"The following Settings apply to the Bitcoin account for the hardware wallet" = "以下设置适用于硬件设备的比特币账户";
"Restore the default" = "Restore Default";
"Version update" = "Version Update";
"User agreement" = "User Agreement";
"The two passwords are different. Please re-enter them" = "Password is different twice, please re-enter";
"HD wallet" = "主钱包";
"HD wallet account" = "主钱包账户";
"BTC wallet" = "比特币账户";
"ETH wallet" = "以太坊账户";
"HECO wallet" = "HECO账户";
"BSC wallet" = "BSC账户";
"HD wallets are known as Hierarchical Deterministic wallets in Chinese. It is by far the best and most convenient deterministic wallet" = "同一台设备至多只有一个主钱包，但其下可以有多个账户。它的底层技术是「分层确定性」，这种钱包格式先进、好用，方便，未来普及率高，兼容性极好。";
"What is HD Wallet" = "什么是主钱包？";
"I know the" = "I Know";
"The wallet name cannot be empty" = "Wallet name cannot be empty";
"delete" = "Delete";
"HD" = "主钱包";
"Change master password" = "Change Master Password";
"Enter your original password" = "Enter Your Original Password";
"After changing the password, your original biometrics (face, fingerprint) will become invalid and need to be reset" = "After changing your password, your original biometrics (face, fingerprints) will be disabled and you will need to reset them.";
"Set your new password" = "Set Your New Password";

"Check the password" = "Verify Password";
"Enter your password" = "Enter Your Password";
"Don't reveal your password to anyone else" = "Do not give your password to anyone else";
"You're done" = "Success";
"Everything seems to be in order! We have nothing to remind you of. In a word, remember to take care of the mnemonic, no one can help you get it back. I wish you play in the chain of blocks in the world happy" = "Everything seems to be in place! We can't remind you of anything else. Anyway, remember to keep the mnemonic safe, because if you lose it, no one can help you get it back. Have fun in the world of blockchain ❤️.";
"Return the wallet" = "Return to Wallet";
"The mnemonic is incorrect" = "Mnemonic Errors";
"To check the" = "Recheck";
"Set the wallet name" = "Set a name for the wallet";
//OKScanVc
"Scan QR Code" = "扫描二维码";
"scan.result" = "扫描结果";
"Photo Album" = "Albums";
"Put QR code in the frame. Scan it." = "Please select the mnemonic QR code from the album or scan the code to identify it.";
"Gentle Hint" = "Warm Hints";
"Gentle Hint：" = "Warm Hints:";
"Set Later" = "Not now";
"Set Now" = "Set up now";
"Please open the camera permissions: Settings->Privacy->Camera->" = "Please open the camera permissions for this app: Phone Settings->Privacy->Camera->";
"Please open the photos permissions: Settings->Privacy->Photos->" = "Please open the photo permissions for this app: Phone Settings->Privacy->Photo->";
"(Open)" = "(Open)";
"management" = "Manage";
"Incorrect phrase" = "Mnemonic Errors";
"HD Wallet root mnemonic" = "主钱包根助记词";
"Mnemonics are used to recover assets in other apps or wallets, transcribe them in the correct order, and place them in a safe place known only to you" = "Mnemonics are used to recover assets in other apps or wallets, transcribe them in the correct order, and place them in a safe place that only you know about.";
"- Do not uninstall OneKey App easily - do not disclose mnemonics or private keys to anyone - do not take screenshots, send sensitive information via chat tools, etc" = "1.Do not easily uninstall the OneKey App\n2.Do not give your mnemonic, private key to anyone\n3.Do not take screenshots, send the above sensitive information via chat tools.";
"Mnemonics are very sensitive and private content, once someone else gets it, your assets may be lost, so do not take screenshots, and pay attention to your surrounding cameras" = "Mnemonic phrases are very sensitive and private, and you could lose all your assets if someone else gets access to them, so don't take screenshots and be aware of the cameras in your neighborhood.";
"Don't a screenshot" = "Do not take screenshots";
"The next step" = "Next ";
"Once deleted: 1. All HD wallets will be erased. 2. Please make sure that the root mnemonic of HD Wallet has been copied and kept before deletion. You can use it to recover all HD Wallets and retrieve assets." = "一旦抹除：\n\n1. 所有主钱包下的账户都会被抹除。\n\n2. 请您在删除前务必确认主钱包的助记词已经抄写并保管好，您可以使用它恢复所有其下账户，从而找回资产。 ";
"⚠️ risk warning" = "⚠️ Risk Warning";
"Delete HD Wallet" = "抹除主钱包";
"Wipe" = "抹除";
"I am aware of the above risks" = "I am aware of the above risks";
"The address cannot be empty" = "The address cannot be empty.";
"Please fill in the mnemonic" = "Please fill in the mnemonic phrase";
"The private key cannot be empty" = "The private key cannot be empty";
"Please enter the name of the wallet" = "请输入账户名称";
"Mnemonic import successful" = "Import mnemonic phrases success";
"The new password cannot be the same as the old one" = "The new password cannot be the same as the original one";
"Password changed successfully" = "Password Change Success";
"The password cannot be empty" = "Password cannot be empty";
"Wallet deleted successfully" = "删除账户成功";
"Does not support FaceID" = "FaceID is not supported";
"Please enter the transfer address" = "请输入收款账号";
"Please enter the transfer amount" = "Please enter the amount of the transfer";
"Lack of balance" = "Insufficient balance";
"Send a success" = "Send Success";
"Unconfirmed"  = "Unconfirmed";
"confirmations" = "Confirmed";
"Signed" = "Signature Completed";
"Partially signed" =  "Partial Signature";
"Unsigned" =  "Unsigned";
"Import success" = "Import Success";
"Legal tender units" = "Fiat Currency Unit";
"Add HD Wallet" = "创建主钱包";
"Support BTC, ETH and other main chain" = "支持 BTC、ETH等多种公链";
"Restore the purse" = "Restore your Main Wallet";
"Import through mnemonic" = "通过助记词";
"No purse" = "无可用账户";
"Edit the name" = "Edit Name";
"The name of the" = "Name";
"determine" = "Confirm";
"The wallet name cannot be empty" = "Wallet name cannot be empty";
"Name modification successful" = "Name Modified Successfully";
"To delete the wallet" = "删除账户";
"This action will delete all data for the wallet, please make sure the wallet is backed up before deleting" = "此操作将会删除该账户的所有数据，请在删除前确保该账户已备份";
"cancel" = "Cancel";
"Export hints" = "Export Hint";
"To master the private data of the wallet is to master the assets of the wallet itself" = "Having access to private wallet data is the same as having access to the wallet assets themselves. Please\n1. Have a pen and paper ready to copy carefully, and please keep them in a safe place after confirming that they are correct. \n2. Do not take screenshots! Mobile photo albums are easily accessed by other applications.  \n3. OneKey does not store any private data and cannot be recovered once lost. The only way to protect your assets is to make a proper backup.";
"I have known" = "Export";
"The only way to protect your assets is to back them up correctly" = "The only way to protect your assets is to make the right backup";
"1. Carefully copy with pen and paper and keep it in a safe place after confirmation. 2. Mobile photo albums are easily accessible by other apps. 2. OneKey does not store any private key, which cannot be recovered once lost" = "1. Have a pen and paper ready to copy carefully and keep them in a safe place after confirming that they are correct. \n2. Do not screenshot! Mobile photo albums are easily accessed by other applications. \n3. OneKey does not store any private key, which cannot be recovered once lost.";
"copy" = "Copy";
"The private key export" = "Private Key Export";
"Custom rate" = "Custom rate";
"Please enter the rate" = "Please enter rate";
"pairing" = "Pairing";
"Open your hardware wallet and hold it close to your phone" = "开启您的硬件设备，并且靠近手机。";
"Locate the following devices" = "Find the following device";
"The connection is successful" = "Connection Succeed";
"disconnect" = "Disconnected";
"The custom" = "customize";
"slow" = "Slow";
"About 0 minutes" = "About 0 minutes";
"recommended" = "Recommend";
"fast" = "Quick";
"Mobile photo albums are very insecure and can be accessed by any app. Go to the phone photo album immediately and permanently delete the screen capture. Your future self will thank you for your decision now." = "Mobile photo albums are very insecure and can be accessed by any app. Immediately go to your phone album and delete the screenshot you just took permanently. In the future you will be thankful for your decision now.";
"You seem to have taken a screenshot just now" = "You seem to have taken a screenshot just now.";
"Mnemonic derivation" = "Export Mnemonic";
"Synchronous server" = "Syncing server";
"Block Browser (BTC)" = "Block Browser (BTC)";
"Block Browser (BTC) USES your favorite browser to view transactions on the chain" = "Block Browser (BTC)\n\nUse your favorite browser to view the on chain transactions information";
"The synchronous server USES the synchronous server to back up and restore multi-signature wallet, and synchronizes unsigned transactions among multiple co-signers; The synchronization server stores only public information such as the wallet public key and name, and does not store any private keys and personal information" = "同步服务器\n 使用同步服务器，可备份和恢复多签账户，并可在多个联署人间同步未签名交易；\n同步服务器仅存储账户公钥、名称等公开信息，不存储任何私钥和个人信息。";
"Electrum node" = "Electrum Node";
"Electrum node selection college node traded using the open source distributed radio and access to information on the chain" = "Electrum Node Selection\nUse its open source distributed nodes for transaction broadcasting and on-chain information acquisition.";
"Alternative nodes" = "Alternate Nodes";
"Price quotation" = "Price Quotes";
"Choosing the right market source only affects the PRICE display of BTC and ETH" = "Choosing the right market source\nOnly affects price display of BTC and ETH.";
"Proxy server" = "Proxy";
"Using a proxy server" = "Use proxy";
"The node type" = "Node Type";
"The IP address" = "IP Address";
"port" = "Port";
"The user name" = "User Name";
"password" = "Password";
"Set up the success" = "Set Succeed";
"Select node type" = "Select Node Type";
"Find the following wallet" = "找到以下账户";
"You have derived the following wallet using the HD mnemonic, select the one you want to recover. If you do not want to recover the wallet for a while, you can skip it and readd it later in the HD Wallet. Your assets will not be lost" = "您曾使用主钱包助记词派生过以下账户， 选择您要恢复的。暂时不想恢复的钱包您可以跳过，并稍后在主钱包中重新添加，您的资产不会丢失。";
"Payment code" = "Receive Code";
"Scan transfer" = "Swipe to Send";
"The wallet address" = "Wallet Address";
"The transfer amount cannot be zero" = "The send amount cannot be zero";
"Enter the transfer amount" = "Enter send amount";
"restore" = "Recovery";
"Wallet names cannot exceed 15 characters" = "账户名称不能超过15个字符";
"The password length is between 8 and 34 digits" = "Password length between 8 and 34 characters";
"The password cannot contain Chinese" = "Password cannot contain Chinese";
"Set fingerprint identification" = "Set Fingerprint Recognition";
"Creating successful" = "Create Succeed";
"I copied" = "I‘ve copied it";
"Display qr code" = "Show QR Code";
"Hide QR code" = "Hide QR Code";
"It is recommended to use" = "Recommended Use";
"Make a backup of your wallet before deleting it" = "删除账户前请先备份";
"return" = "Return";
"This action deletes all data for the wallet. In order to avoid loss of your property, please complete the backup of your wallet first." = "此操作将会删除该账户的所有数据。为了避免您的财产损失，请先完成备份。";
"Independent wallet mnemonic" = "独立账户助记词";
"Hardware recovery for HD Wallet" = "硬件恢复的主钱包";
"Hardware derived" = "Hardware Derivation";
"Observation" = "观察";
"Delete a separate wallet" = "删除独立账户";
"Once deleted: 1. The wallet will be erased from the App. 2. Please make sure that the mnemonic of the independent wallet has been copied and kept before deletion. You can use it to recover the wallet, so as to recover the assets." = "一旦删除：\n\n1. 该账户将会从 App 中被抹除。\n\n2. 请您在删除前务必确认该账户的助记词已经抄写并保管好，您可以使用它进行恢复，从而找回资产。 ";
"OenKey request enabled" = "OneKey request open";
"KeyStore cannot be empty" = "KeyStore cannot be empty";
"Please go to create a wallet first" = "Please create wallet";
"Transaction details" = "Transaction Details";
"Confirm the payment" = "Confirm payment";
"The sender" = "Sender";
"The receiving party" = "Receiver";
"Transaction fee" = "Transaction Fee";
"Open your hardware wallet and hold it close to your phone" = "开启您的硬件设备，并且靠近手机。";
"OneKey is currently supported (limited edition with coins and letters)" = "Support OneKey (including Bixin Limited Edition)";
"pairing" = "Pairing";
"Open your hardware wallet and hold it close to your phone." = "开启您的硬件设备，并且靠近手机。";
"this is already activated device, you can..." = "🔑 This is an activated device that you can...";
"Add a new wallet (recommended)" = "添加账户（推荐）";
"Up to 20 derived wallets can be created, as needed" = "支持 BTC、ETH 等多种公链";
"Restore the wallet that was created from this hardware device" = "恢复曾经使用过的钱包";
"If you have ever deleted a wallet created by the device on your phone, you can recover it this way." = "如果您曾经在手机删除过由该设备创建的账户，可以用此办法恢复。";
"Create a Condominium wallet (Advanced)" = "创建共管账户（高级）";
"At least 2 devices are required to cooperate. Before adding, make sure that all hardware devices that want to participate in the public pipe are activated" = "At least 2 devices are required. Make sure all hardware devices that you want to participate in public management are activated before adding them.";
"Enter your 6-digit password according to the PIN code location comparison table displayed on the device" = "根据设备显示的 PIN 码位置对照表 输入您的PIN密码";
"The number keys on the phone change randomly every time. The PIN number is not retrievable. You must keep it in mind" = "The number keys on your phone change randomly each time, and it is important to remember that PIN code cannot be recovered if you forget them.";
"confirm" = "Confirm";
"Check the PIN code" = "Verify PIN Code";
"Activate hardware wallet" = "激活硬件设备";
"Set device name" = "Set device name";
"Verify on the equipment" = "Confirm on the device";
"Set the PIN" = "Set Pin code";
"Each use requires a PIN code to gain access to the hardware wallet" = "每次使用需输入PIN码来获取硬件设备的访问权限。";
"Wallet activation successful" = "账户激活成功";
"Your hardware wallet has been successfully activated and we have nothing to remind you of. In a word, please take good care of it. No one can help you get it back. I wish you play in the chain of blocks in the world happy" = "您的硬件设备激活成功， \n我们也没什么可提醒您的了。 \n总之，切记保管好它，\n 搞丢了没有任何人可以帮您找回来。 \n祝您在区块链的世界玩儿开心❤️。";
"Set a new password" = "Set new password";
"Please enter again" = "Please enter again";
"Temporary does not support" = "Temporarily not supported";
"You have successfully restored the HD Wallet on this device. We believe that you are already familiar with backing up and keeping mnemonics, so we do not require you to repeat the backup of your existing mnemonic" = "您已经成功在这台设备上恢复了主钱包，我们相信您已经对于备份和保管助记词轻车熟路了，所以不再要求您重复备份已有的助记词";
"But again, don't lose your mnemonic in case you need to use it again" = "But once again, don't lose your mnemonic hand, as you may need it again in the future.";
"Take care of your mnemonic" = "Keep your mnemonics safe";
"The wallet has not been backed up. For the safety of your funds, please complete the backup before using this address to initiate the collection" = "该账户尚未备份。为了您的资金安全，请完成备份后再使用该地址发起收款。";
"The wallet has not been backed up. For the safety of your funds, please complete the backup before initiating the transfer using this address" = "该账户尚未备份。为了您的资金安全，请完成备份后再使用该地址发起转账。";
"prompt" = "Hint";
"I have known_alert" = "I already know";
"Reset the App" = "Reset APP";
"This will delete all the data in the App, including the currently created wallet and custom Settings. This operation is irrevocable. Please make a backup of your wallet before deleting it so that you can recover your assets" = "This will delete all data in the App, including the currently created wallet and custom settings. This action cannot be undone. Please be sure to make a backup of your wallet before deleting it in order to retrieve your assets.";
"Are you sure you want to do this" = "Confirm you want to perform this operation?";
"This will immediately delete all data that you have created in OneKey, and unbacked wallets will never be retrieved. Are you sure you want to proceed with the operation" = "This will immediately delete all data you have created at OneKey and any wallets not backed up will never be recovered. Confirm you want to proceed with this operation?";
"I have confirmed, reset immediately" = "I have confirmed, reset immediately";
"Reset successful, please restart the application." = "Reset successfully, please restart the application";
"More child wallets are derived from mnemonics" = "通过助记词派生出更多子账户";
"easy to use" = "多公链、简单、安全、好用";
"HD derived wallet" = "主钱包";
"Derivations based on HD Root Mnemonics (recommended)" = "主钱包账户（推荐）";
"The HD root mnemonic is derived" = "导出主钱包的助记词";
"Delete all HD-derived wallets" = "抹除主钱包";
"Enter the password" = "Enter password";
"For the current purpose of observing the wallet, the initiated transfer shall be signed by scanning the code with the cold wallet holding the private key" = "Currently it is an observation wallet, and initiated send need to be swept and signed using the cold wallet that holds the private key.";
"There is no" = "None";
"Change master password" = "Change Master Password";
"Set the master password" = "Set Master Password";
"Use cold wallet for code scanning signatures" = "Use Cold Wallet for sweep signatures";
"Are you sure you want to use the address of the wallet to initiate a collection in order to view the wallet?" = "Currently it is an observation wallet，sure you want to initiate receiving using the wallet's address?";
"The signature" = "签名";
"trading" = "交易";
"The message" = "消息";
"Enter the transaction message" = "输入交易报文";
"Enter the message to be signed" = "输入待签名消息";
"Verify the signature" = "验证签名";
"Enter the original message" = "输入原始消息";
"Enter the public key" = "输入公钥";
"Enter the signed post message" = "输入签名后消息";
"The original message" = "原始信息";
"The public key" = "公钥";
"Post signed message" = "签名后消息";
"validation" = "验证";
"Verification by" = "验证通过";
"Validation fails" = "验证失败";
"The signature information is consistent with the public key/original informatio" = "签名信息与公钥/原始信息一致";
"The signature information does not match the public key/original information" = "签名信息与公钥/原始信息不符";
"return" = "Return";
"This action will delete the wallet's data stored in the App, but you can still recover from the hardware wallet that knows its mnemonic words. Are you sure you want to continue?" = "此操作将会删除 App 中存储的该账户的数据，但您仍可通过掌握其助记词的硬件钱包恢复。确定要继续此操作吗？";
"The wallet's private key or mnemonic has been securely stored on the hardware device. If you need to export a mnemonic for your hardware wallet, please go to [My Hardware] to find your device to export." = "该钱包的私钥或助记词已经妥善的保管在硬件设备中。如果您需要导出硬件设备的助记词，请前往「我的 ➡️ 硬件 ➡ 全部设备」查找您要导出的设备。";
"Discover a new device you can..." = "🎉 发现一个新设备 您可以...";
"Activated as a new device" = "作为新设备激活（推荐）";
"Activate the hardware wallet" = "激活硬件设备";
"The hardware wallet will generate 12-digit mnemonic words for you" = "硬件设备将为你生成 12 位助记词";
"The hardware wallet will generate 24-digit mnemonic words for you" = "硬件设备将为你生成 24 位助记词";
"Use 12-digit mnemonic words" = "使用 12 位助记词";
"Use 24-digit mnemonic words" = "使用 24 位助记词";
"It is suitable for the vast majority of first-time users of the hardware wallet" = "适合于绝大多数首次使用硬件设备的用户";
"12" = "12位";
"24" = "24位";
"Select the number of mnemonic words" = "选择助记词位数";

"general" = "通用";
"advanced" = "高级";
"done" = "完成";
"Hardware wallet account" = "硬件";
// Hardware Wallet Associated - start
"hardwareWallet.devices" = "设备";
"hardwareWallet.pair.backupTip" = "备份了主钱包助记词的设备将仅被用来恢复您在 App 上创建的主钱包，如果您希望使用这台设备的更多功能，可以在妥善保管主钱包的助记词后（手动抄写），将这台设备恢复到出厂模式，然后重新配对并激活设备，将其作为普通硬件钱包使用。";
// 升级固件
"hardwareWallet.update" = "升级固件";
"hardwareWallet.update.title" = "固件升级";
"hardwareWallet.update.update" = "升级";
"hardwareWallet.update.currentDesc" = "当前系统固件版本 <frameworkVersion> \n当前蓝牙固件版本 <bluetoothVersion> \n升级固件前务必备份好钱包，否则可能造成资产损失";
"hardwareWallet.update.newSysAvailable" = "新系统固件可用";
"hardwareWallet.update.newBluetoothAvailable" = "新蓝牙固件可用";
"hardwareWallet.update.uptodate" = "设备固件及蓝牙版本已经是最新版本。";
"hardwareWallet.update.sysUpdating" = "正在升级系统固件";
"hardwareWallet.update.bluetoothUpdating" = "正在升级蓝牙固件";
"hardwareWallet.update.downloading" = "固件下载中，\n请耐心等待";
"hardwareWallet.update.installing" = "固件安装中";
"hardwareWallet.update.installed" = "固件升级完成";
"hardwareWallet.update.warning" = "为避免设备重置，升级期间请勿离开 OneKey App，并确保硬件钱包始终处于解锁状态。";
"hardwareWallet.update.needUpdate" = "当前硬件设备系统版本过低，请先升级。";

"hardwareWallet.lanuage.desc" = "选择硬件设备的显示语言";

"hardwareWallet.info" = "设备信息";
"hardwareWallet.info.id" = "设备ID";
"hardwareWallet.info.buletoothName" = "蓝牙名称";
"hardwareWallet.info.sysVersion" = "系统固件版本";
"hardwareWallet.info.buletoothVersion" = "蓝牙固件版本";

"hardwareWallet.autoOff" = "自动关机";
"hardwareWallet.autoOff.desc" = "设置自动关机时间，到点自动关闭设备以节省电量";
"hardwareWallet.autoOff.timeout" = "定时";
"hardwareWallet.autoOff.second" = "秒";

"hardwareWallet.verify" = "防伪校验";
"hardwareWallet.verify.connecting" = "正在连接设备";
"hardwareWallet.verify.connectingTip" = "数据传输需要一定时间，\n把您的设备放在手机旁边。";
"hardwareWallet.verify.processing" = "正在处理...";
"hardwareWallet.verify.connectingDevice" = "连接设备";
"hardwareWallet.verify.getSign" = "获取防伪签名";
"hardwareWallet.verify.submitting" = "提交防伪验证信息";
"hardwareWallet.verify.pass" = "验证通过";
"hardwareWallet.verify.fail" = "验证失败";
"hardwareWallet.verify.passDesc" = "这是 OneKey 官方出品\n内置官方固件\n请放心使用";
"hardwareWallet.verify.failDesc" = "这台设备并未运行官方固件\n可能被篡改\n如果这不是您自己的行为\n请联系销售方处理";
"hardwareWallet.verify.netErr" = "连接 OneKey 认证服务器失败，\n请检查你的网络";
"hardwareWallet.verify.return" = "返回设备";

"hardwareWallet.pin" = "修改 PIN 码";
"hardwareWallet.pin.success" = "修改 PIN 码成功";
"hardwareWallet.pin.fail" = "修改 PIN 码失败";
"hardwareWallet.pin.title" = "修改设备 PIN 码";
"hardwareWallet.pin.inputPinTip" = "输入设备原 PIN 码\n以继续";
"hardwareWallet.pin.newPinTip" = "干的好，继续根据设备\n上的 PIN 码位置\n设置您的新 PIN 码";
"hardwareWallet.pin.keyboardTip" = "手机上的数字键位每次都会随机改变。\nPIN 码忘记不可找回，您务必要牢记。";
"hardwareWallet.pin.comfirm" = "最终确认";
"hardwareWallet.pin.comfirmTip" = "在您的设备上确认新的 PIN 码，\n这是最后一步。";
"hardwareWallet.pin.verifyMethod" = "PIN 码校验方式";
"hardwareWallet.pin.verifyMethodTip" = "选择校验 PIN 码的方式";
"hardwareWallet.pin.onDevice" = "硬件上输入";
"hardwareWallet.pin.onApp" = "APP 上输入";
"hardwareWallet.pin.verifyMethodOnDevice" = "在设备上输入 PIN 码";
"hardwareWallet.pin.verifyMethodOnDeviceTip" = "请在您的硬件设备上完成 PIN 码的输入。";

"hardwareWallet.recover.title" = "恢复出厂设置";
"hardwareWallet.recover.tip" = "恢复出厂设置后：\n1. 您存储在这个硬件设备中的私钥或助记词将被抹除；\n2. 您在 OneKey App 中用这个钱包创建的账户依然存在，但因为缺少私钥，无法动用其上的资产。除非您在此之前就备份了助记词或私钥，使用它们恢复硬件设备，从而重新掌控相关账户。 ";


"hardwareWallet.xpub" = "查看多重签名扩展公钥（xPub）";
"hardwareWallet.xpub.xpub" = "扩展公钥";
"hardwareWallet.xpub.title" = "多重签名扩展公钥";
"hardwareWallet.xpub.copy" = "已复制到剪贴板";
"hardwareWallet.xpub.tip" = "「扩展公钥」，也被称为XPUB。是比特币标准(BIP32)的一部分，不包含任何私钥。\n您在创建或加入共管（多重签名）钱包时，会用到下方显示的扩展公钥。";

"hardwareWallet.delete" = "删除设备";
"hardwareWallet.delete.tip" = "这个硬件设备会在您的设备列表消失。您用这个硬件设备创建的账户依然可以正常显示，下次您使用的时候会重新配对并恢复。";
"hardwareWallet.delete.cancel" = "撤回";

"hardwareWallet.id_not_match" = "设备 ID 不一致";

"bluetooth.connection.fail" = "蓝牙连接失败";
"bluetooth.connection.timeout" = "蓝牙连接超时";

// Hardware Wallet Associated - end
"success" = "成功";
"fail" = "失败";

"Search your wallet..." = "搜寻钱包中...";
"You have created these wallets for this App, select which you want to restore" = "您曾在此 App 创建这些钱包，选择您要恢复的。";
"No wallet" = "没有钱包";
"Restore success" = "恢复成功";
"Touch Light" = "轻触照亮";
"Touch Off" = "轻触关闭闪光灯";
"Please copy your 12 - digit mnemonic words" = "请抄写你的 12 位助记词";
"Please copy your 24 - digit mnemonic words" = "请抄写你的 24 位助记词";
"1. Copy carefully with paper and pen, and keep it properly after reconfirming. 2. OneKey does not store private data for you, and mnemonic words once lost cannot be retrieved." = "1. 备好纸笔认真抄写，再次确认无误后请妥善保管。 \n2. OneKey 不会为您存储私密数据，助记词一旦丢失将无法找回。";
"Your mnemonic has been successfully backed up to this device, and we have nothing more to remind you of. In a word, remember to take good care of it, lost no one can help you find it. Have fun in the world of blockchain." = "您的助记词已经成功备份到这台设备， 我们也没什么可提醒您的了。 总之，切记保管好它， 搞丢了没有任何人可以帮您找回来。 祝您在区块链的世界玩儿开心❤️。";
"Restore your HD wallet completely. Any wallet derived from the original HD mnemonic will be restored" = "完整恢复您的主钱包，任何由属于该主钱包的账户都将获得复原。";
"This is a special device that stores HD wallet mnemonic words. You can..." = "🔑 这是一台存储了主钱包助记词的特殊设备，您可以...";
"Restore the phone HD wallet" = "恢复手机主钱包";
"Have to check" = "已核对";
"Hardware wallet checking" = "硬件钱包核对中";
"Confirm at the facility" = "在设备进行确认";
"The deal" = "交易完成";
"View Transaction Details" = "查看交易详情";
"Trade Confirmation" = "交易确认中";
"Time out for connecting Bluetooth device. Please make sure your device has Bluetooth enabled and is at your side" = "连接蓝牙设备超时，请确认您的设备已经开启蓝牙并且在您的身边";
"Import failure" = "导入失败";
"Matching failure" = "配对失败";
"The rate is lower than the minimum for the current network. Please reenter" = "费率低于当前网络的最小值，请重新输入";
"GasPrice is lower than the minimum value. Please re-enter" = "Gas Price 低于最小值请，重新输入";
"Backup to inactive devices only" = "只能备份到未激活的设备";
"The HD wallet already exists locally. The BACKUP mode hardware wallet cannot be connected again" = "本地已存在HD钱包，无法再连接 backup 模式的硬件钱包";
"The wallet already exists" = "该钱包已存在";
"Bluetooth firmware version is too low, please skip to web upgrade" = "硬件蓝牙版本过低，请跳转到web升级";
"Update tip" = "更新提示";
"Input PIN" = "输入PIN";
"Bluetooth connection failed, please try again" = "蓝牙连接失败，请重试";
"connection is broken" = "蓝牙连接已断开";
"Bluetooth of the system has been turned off. Please turn it on" = "系统蓝牙被关闭，请开启";
"This operation is not supported if the current device is not active, or if the special device is backed up" = "当前设备未激活，或者是备份的特殊设备，不支持该操作";
"A change in the device ID of the currently connected device was detected, possibly because the device had been reset. This will cause the state of the device displayed at this point to differ from the real state of your device. Please go back to the previous page and choose again." = "检测到当前连接设备的设备 ID 发生了变化，可能是因为该设备曾进行过重置。 这将导致此刻展示的设备状态与您的设备真实状态有差异。请退回到上一页重新选择。";
"The device ID is inconsistent" = "设备 ID 不一致";
"Save" = "保存";
"Save Success" = "已保存到相册";
"Save Failed" = "保存失败";
"Share QRCode" = "分享 %@ 收款码";

"wallet.btc.selectAddrType" = "选择 BTC 地址类型";
"wallet.btc.selectAddrTypeTip" = "地址类型选择后无法更改，推荐使用兼容隔离见证 SegWit。";
"wallet.btc.segwit" = "兼容隔离见证 SegWit";
"wallet.btc.segwitDesc" = "以 3 开头，广泛普及，转账手续费较低";
"wallet.btc.nativeSegwit" = "原生隔离见证 Native SegWit";
"wallet.btc.nativeSegwitDesc" = "以 bc1 开头，正在普及，转账手续费最低";
"wallet.btc.normalAddr" = "普通地址 Legacy";
"wallet.btc.normalAddrDesc" = "以 1 开头，全面普及，转账手续费中等";

".add" = "添加";

"cs" = "客服";
"cs.title" = "客户支持";
"cs.ticket" = "工单";
"cs.ticket.submit" = "提交工单";
"cs.ticket.history" = "查看历史工单";

"token.management" = "代币管理";
"token.noResult" = "找不到搜索结果";
"token.icon" = "代币图标";
"token.name" = "代币名称";
"token.add" = "添加代币";
"token.add.follow" = "添加以下代币";
"token.add.success" = "添加成功";
"token.contractAddress" = "合约地址";
"token.contractAddress.tip" = "请输入有效的合约地址";
"token.contractAddress.notFound" = "合约地址不存在";
"token.find.title" = "找到<placeholder1>个结果";
"token.blance" = "余额";
"token.select" = "选择代币";
"token.hot" = "热门代币";
"token.more" = "更多";

"assets.search.placeholder" = "搜索账户或代币";

"This operation only supports BACKUP ONLY special devices" = "该操作仅支持backup only特殊设备";
"Signature error or cancellation" = "签名出错或取消";

"Failed to get the rate" = "获取费率失败";
"Select the assets to add" = "选择要添加的资产";
"Add the asset" = "添加资产";
"sendcoin.about" = "约";
"sendcoin.minutes" = "分钟";
"Expected time:" = "预计时间：";
"The minimum amount must not be less than 546 sat" = "最低转账金额不得低于546 sat";
"Please enter the Gas Price" = "请输入 Gas Price";
"list.Hardware wallet" = "硬件钱包";
"Transaction format error" = "交易格式错误";
"selectAccount" = "选择账户";
"Keystore export" = "Keystore 导出";
"The Bluetooth connection is abnormal. Please try again" = "蓝牙连接异常，请重试";
"Block Browser (ETH)" = "区块浏览器（ETH）";
"Block Browser (ETH) USES your favorite browser to view transactions on the chain" = "区块浏览器（ETH） \n\n使用您喜欢的浏览器查看链上交易信息";
"TouchID is not supported or TouchID is not enabled" = "不支持TouchID,或未打开TouchID";
"FaceID is not supported or FaceID is not enabled" = "不支持FaceID,或未打开FaceID";

// Discover Associated - start

"Discover" = "发现";
"Operation name" = "操作名称";
"Payment account" = "付款账户";
"Receiving address" = "收款地址";
"Signed message" = "签名消息";
"Connecting" = "连接中";
"Please unlock the hardware wallet and keep it within the effective range of the mobile phone’s Bluetooth" = "请解锁硬件钱包，并保持其在手机蓝牙有效范围内";

"Failed to send transaction" = "发送交易失败";
"Signature error" = "签名出错";
"Cancel operation" = "取消操作";
"Missing transaction data" = "交易数据缺失";
"Your use of third-party DApps will be applicable to the third-party DApp’s \"Privacy Policy\" and \"User Agreement\", and %@ will be directly and solely liable to you" = "您在第三方 DApp 上的使用行为将适用于第三方 DApp 的《隐私政策》和《用户协议》，由 %@ 直接并单独向您承担责任";
"Continue to visit" = "继续访问";
"Switch to %@ account?" = "切换到 %@ 账户 ？";
"Current DApp only supports %@ account" = "当前 DApp 只支持 %@  账户";
"Stay tuned" = "敬请期待";
"Sorry, access failed, please try again or check the network" = "抱歉，访问失败，请重试或检查网络";
"Please enter the correct IP address" = "请输入正确的ip地址";
"Switch account" = "切换账号";
"Favorites" = "收藏";
"Onekey key" = "Onekey 口令";
"Floating window" = "浮窗";
"Refresh" = "刷新";
"Share" = "分享";
"Copy URL" = "复制URL";
"Browser opens" = "浏览器打开";
"The minimum limit of Gas Price %@ gwei" = "Gas Price 的最小限额 %@ gwei";
"Gas Price maximum limit %@ gwei" = "Gas Price 的最大限额 %@ gwei";
"The minimum gas limit %@" = "Gas Limit 的最小限额 %@";
"The maximum gas limit %@" = "Gas Limit 的最大限额 %@";
"Too little Gas Limit will cause the transaction to fail. Do you want to continue?" = "Gas Limit 太少将会导致交易失败，是否继续？";
"Gas Limit is too much, do you want to continue?" = "Gas Limit 太多，是否继续？";
"Too little Gas Price will cause the transaction to fail. Do you want to continue?" = "Gas Price 太少将会导致交易失败，是否继续？";
"Gas Price is too much, do you want to continue?" = "Gas Price 太多，是否继续？";
"Continue" = "继续";
"Incorrect link format" = "链接格式有误";
"Confirm delete" = "确定删除";
"My Favorites" = "我的收藏";
"No content" = "暂无任何内容";

// Discover Associated - end

"No account with transaction history was found. You can choose to create a new account" = "没有找到有交易记录的账户，您可以选择创建新账户";
"In the connection..." = "连接中...";
"It is possible that the" = "可能是";
"has been reset and changed the mnemonic. Import the original mnemonic into this hardware wallet and try again." = "曾进行过重置并更换了助记词。请将原助记词导入此硬件钱包，然后再试一次。";
"The operation failure" = "操作失败";
`;
  const result = await transform(data);

  log(result);
})();



