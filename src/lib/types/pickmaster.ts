export interface Vector3 {
  $type: 'PickMaster.Core.Utils.MathStructure.Vector3, PickMaster.Core.Utils';
  x: number;
  y: number;
  z: number;
  IsNaN: boolean;
}

export interface PositionModel {
  $type: 'PickMaster.Core.Utils.BaseData.ModelShared.PositionModel, PickMaster.Core.Utils';
  X: number;
  Y: number;
  Z: number;
  RX: number;
  RY: number;
  RZ: number;
}

export interface AppearanceModel {
  $type: 'PickMaster.Core.Process.Item.AppearanceModel, PickMaster.Core';
  ItemColor: string;
  HasLable: boolean;
  HasTexture: boolean;
  LabelModel: {
    $type: 'PickMaster.Core.Process.Item.LabelModel, PickMaster.Core';
    Path: string | null;
    LabelLocationType: number;
  };
  TexturePath: string | null;
  IsShowingContour: boolean;
  IsShowingOrientationMarker: boolean;
}

export interface PickMasterItem {
  $type: 'PickMaster.Core.Process.Item.ItemModel, PickMaster.Core';
  RapidParameter: {
    $type: 'PickMaster.Core.Process.Item.RapidParameterModel, PickMaster.Core';
    AcceptType: number;
    RejectType: number;
  };
  IgnoreOrientation: boolean;
  ItemFileName: string;
  CustomizedItemPosition: PositionModel;
  AppearanceModelName: string;
  ItemCircularConveyorId: string;
  ItemType: number;
  Size: Vector3;
  AppearanceModel: AppearanceModel;
  SourceType: number;
  PositionModel: PositionModel;
  ExtSensorPositionGeneratorList: {
    $type: string;
    $values: unknown[];
  };
  Name: string;
  Index: number;
  Id: string;
}

export interface ArrangedItem {
  $type: 'PickMaster.Core.Process.Container.ArrangedItemModel, PickMaster.Core';
  ItemId: string;
  X: number;
  Y: number;
  Z: number;
  RX: number;
  RY: number;
  RZ: number;
  Order: number;
  Id: string;
}

export interface PickMasterLayer {
  $type: 'PickMaster.Core.Process.Container.LayerModel, PickMaster.Core';
  LayerId: number;
  Offset: number;
  ArrangedItems: {
    $type: string;
    $values: ArrangedItem[];
  };
  SortingMethod: number;
}

export interface PickMasterTray {
  $type: 'PickMaster.Core.Process.Container.ContainerModel, PickMaster.Core';
  ContainerProperties: {
    $type: 'PickMaster.Core.Process.Container.ContainerPropertiesModel, PickMaster.Core';
    AppearanceModelName: string;
    CustomizedContainerFileName: string;
    CustomizedContainerPosition: PositionModel;
  };
  ContainerPattern: {
    $type: 'PickMaster.Core.Process.Container.ContainerPatternModel, PickMaster.Core';
    Layers: {
      $type: string;
      $values: PickMasterLayer[];
    };
  };
  ContainerPickId: string;
  ContainerIOPlaceId: string;
  ContainerIOPickId: string;
  ContainerCircularConveyorPlaceId: string;
  ContainerCircularConveyorPickId: string;
  ContainerVisionPickId: string;
  ItemType: number;
  Size: Vector3;
  AppearanceModel: AppearanceModel;
  SourceType: number;
  PositionModel: PositionModel;
  ExtSensorPositionGeneratorList: { $type: string; $values: unknown[] };
  Name: string;
  Index: number;
  Id: string;
}

export const isPickMasterTray = (j: unknown): j is PickMasterTray =>
  (j as Record<string, unknown>)?.$type?.toString().includes('ContainerModel') === true;

export const isPickMasterItem = (j: unknown): j is PickMasterItem =>
  (j as Record<string, unknown>)?.$type?.toString().includes('ItemModel') === true;
