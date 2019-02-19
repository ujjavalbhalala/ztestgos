sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("ztestgos.controller.Picture", {

		onInit: function() {
			this.getView().setModel(new JSONModel({
				photos: []
			}));
		},

		/////////////////////////////////////////////
		//  EVENTS
		/////////////////////////////////////////////
		onSnapshot: function(oEvent) {
			// The image is inside oEvent, on the image parameter,
			// let's grab it.

			/*var oModel = this.getView().getModel();
			var aPhotos = oModel.getProperty("/photos");
			aPhotos.push({
				src: oEvent.getParameter("image")
			});
			oModel.setProperty("/photos", aPhotos);
			oModel.refresh(true);*/

			var image = oEvent.getParameter("image");
			var fileType = image.substring(image.indexOf(":") + 1, image.indexOf(";"));
			var fileData = image.split(",")[1];

			var oModel = this.getOwnerComponent().getModel("test01");

			var data = {
				ID: "89000000064000100010",
				Object: "BUS204502",
				FileType: fileType,
				FileData: fileData.toString()
			};
			var that = this;
			oModel.create("/GOSDocSet", data, {
				success: function(oData) {
					var oModel = that.getView().getModel();
					var aPhotos = oModel.getProperty("/photos");

					var img = "data:" + oData.FileType + ";base64," + oData.FileData;
					aPhotos.push({
						src: img
					});

					oModel.setProperty("/photos", aPhotos);
					oModel.refresh(true);

				},
				error: function(e) {
					//alert("Error Due to Upload");
				}
			});


			//break;
		},
		getAttachments: function(oEvent) {
			var oModel = this.getOwnerComponent().getModel("test01");
			var that = this;
			var id = "123";
			oModel.read("/GOSDocSet", {
				urlParameters: {
					$filter: "ID eq '" + id +
						"'"
				},
				success: function(oData) {
					var oDModel = that.getView().getModel();
					//var aPhotos = oDModel.getProperty("/photos");
					var aPhotos = [];

					var aImage = oData.results;
					for (var i = 0; i < aImage.length; i++) {
						var img = "data:" + aImage[i].FileType + ";base64," + aImage[i].FileData;
						aPhotos.push({
							src: img
						});
					}

					oDModel.setProperty("/photos", aPhotos);
					oDModel.refresh(true);
					//
				},
				error: function(e) {
					//
				}
			});

		},
		onTabSelect: function(oEvent) {
			var oTab = oEvent.getParameter("key");
			var oCamera = this.getView().byId("idCamera");
			if (oTab !== "demo") {
				oCamera.stopCamera();
			} else {
				oCamera.rerender();
			}
		},

		startCamera: function() {
			var oCamera = this.getView().byId("idCamera");
			oCamera.rerender();
		},

		stopCamera: function() {
			var oCamera = this.getView().byId("idCamera");
			oCamera.stopCamera();

		}

	});
});