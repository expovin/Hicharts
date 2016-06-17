define( [
			"qlik", 
			"text!./Hicharts.ng.html", 
			"css!./Hicharts.css",
			"./canvasjs.min",
			"./DataHelpper"
		], function ( qlik, template ) {
		"use strict";
		
	var me = {
		initialProperties: {
			version: 1.2,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 10,
					qHeight: 100
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 1,
					max: 2
				},
				measures: {
					uses: "measures",
					min: 1,
					max: 2
				},
				sorting: {
					uses: "sorting"
				},
				settings : {
					uses : "settings",
					items: {
						general: {
							type: "items",
							label: "General",
							items: {
								Color: {
									type: "string",
									expression: "none",
									label: "Text color",
									defaultValue: "#000000",
									ref: "vars.color"
								},
								FontSize: {
									type: "string",
									expression: "none",
									label: "Font Size",
									defaultValue: "11",
									ref: "vars.fontSize"
								},
							},
						},
						bar: {
							type: "items",
							label: "Bar",
							items: {
								barFillColor: {
									type: "string",
									expression: "none",
									label: "Fill color Separated by comma if stacked bar. If Empty, use default Sense palette",
									defaultValue: "#4477AA",
									ref: "vars.bar.fillColor"
								},
							},
						},

					}
				}
			}
		}
	};
	
		// Get Engine API app for Selections
	me.app = qlik.currApp(this);
	
	me.snapshot = {
		canTakeSnapshot : true
	};	
	

		me.paint = function($element,layout) {
		    
			$element.append($('<div />;').attr("id", "chartContainer"));
			$("#chartContainer").css("height", "100%");
		
			var mychart =  {
			        "title":
				        {
					        "text": layout.InnerTitle 
					    },
				        subtitles:
				            [
				                {
					                "text" : layout.subtitle
					            },
				            ],
				        animationEnabled: true,
			      		legend: 
			      			{
			        			cursor:"pointer",
			        			itemclick : function(e) {
			          				if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			              				e.dataSeries.visible = false;
			          				}
			          				else {
			              				e.dataSeries.visible = true;
			          				}
			          				chart.render();
			        			}
			      			},

			      		// Data Section
				        data : []
				};

				/*
					  layout.qHyperCube.qEffectiveInterColumnSortOrder : Effettivo ordine di sort tra le colonne
					  layout.qHyperCube.qDimensionInfo  : (info sulle dimensioni) length ritorna il numero di dimensioni
					  layout.qHyperCube.qMeasureInfo     : (info sulle misure) lenght ritorna il numero di misure
				*/

                    // create a new array that contains the dimension labels
                    var dimensionLabels = layout.qHyperCube.qDimensionInfo.map(function (d) {
                        return d.qFallbackTitle;
                    });

                    // create a new array that contains the measure labels
                    var measureLabels = layout.qHyperCube.qMeasureInfo.map(function (d) {
                        return d.qFallbackTitle;
					});

                var newDataMatrix;
                console.log(layout);
                if (dimensionLabels.length > 1)
                	newDataMatrix = doubleDimension (layout,dimensionLabels,measureLabels);
                else
                    newDataMatrix = singleDimension(layout,dimensionLabels,measureLabels);

				

				mychart.data = newDataMatrix;


			var chart = new CanvasJS.Chart("chartContainer",mychart);
		
			chart.render();
		
		};
		
		return me;

	} );
