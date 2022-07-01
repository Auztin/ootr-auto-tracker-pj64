var SAVE = 0x8011A5D0;
var BASE = 0x80110000;
var BIT1 = 1 << 0;
var BIT2 = 1 << 1;
var BIT3 = 1 << 2;
var BIT4 = 1 << 3;
var BIT5 = 1 << 4;
var BIT6 = 1 << 5;
var BIT7 = 1 << 6;
var BIT8 = 1 << 7;
var BIT9 = 1 << 8;
var BIT10 = 1 << 9;
var BIT11 = 1 << 10;
var BIT12 = 1 << 11;
var BIT13 = 1 << 12;
var BIT14 = 1 << 13;
var BIT15 = 1 << 14;
var BIT16 = 1 << 15;
var BIT17 = 1 << 16;
var BIT18 = 1 << 17;
var BIT19 = 1 << 18;
var BIT20 = 1 << 19;
var BIT21 = 1 << 20;
var BIT22 = 1 << 21;
var BIT23 = 1 << 22;
var BIT24 = 1 << 23;
var BIT25 = 1 << 24;
var BIT26 = 1 << 25;
var BIT27 = 1 << 26;
var BIT28 = 1 << 27;
var BIT29 = 1 << 28;
var BIT30 = 1 << 29;
var BIT31 = 1 << 30;
var BIT32 = 1 << 31;
var prevFlags = {};
var prevItems = {};
var prevDungeons = {};
var prevDungeonTypes = {};
var shops = {};
var locations = {};
var location = 'overworld';
var findItemLocationsCache = null;
var findDungeonTypeAddrCache = null;
var changed = false;
var saveFile = null;
var currentMode = 0;

function inArray(val, array) {
  return array.indexOf(val) >= 0;
}

function saveState() {
  if (!changed || saveFile == null) return false;
  try {
    var saveData = {
      prevFlags: prevFlags,
      prevItems: prevItems,
      prevDungeons: prevDungeons,
      prevDungeonTypes: prevDungeonTypes,
      shops: shops,
      locations: locations,
    }
    fs.writefile(saveFile, JSON.stringify(saveData));
    changed = false;
    return true;
  } catch (e) {
    return false;
  }
}
setInterval(saveState, 1000);

function loadState() {
  try {
    saveFile = pj64.romInfo.filePath+'.ats';
    var saveData = JSON.parse(fs.readfile(saveFile));
    prevFlags = saveData.prevFlags;
    prevItems = saveData.prevItems;
    prevDungeons = saveData.prevDungeons;
    prevDungeonTypes = saveData.prevDungeonTypes;
    shops = saveData.shops;
    locations = saveData.locations;
  } catch (e) {
    prevFlags = {};
    prevItems = {};
    prevDungeons = {};
    prevDungeonTypes = {};
    shops = {};
    locations = {};
  }
  for (var i = 0; i < clients.length; i++) {
    sendAllData(clients[i]);
  }
}

function checkFlags() {
  var flags = {};
  flags['area/kokiri'] = {};
  flags['area/desert'] = {};
  flags['area/colossus'] = {};
  flags['area/river'] = {};
  flags['area/hyrule_field'] = {};
  flags['area/gerudo_valley'] = {};
  flags['area/lake'] = {};
  flags['area/lonlon'] = {};
  flags['area/gerudo'] = {};
  flags['area/woods'] = {};
  flags['area/meadow'] = {};
  flags['area/town_entrance'] = {};
  flags['area/castle_town'] = {};
  flags['area/temple_time'] = {};
  flags['area/castle'] = {};
  flags['area/castle_ganon_outside'] = {};
  flags['area/kakariko'] = {};
  flags['area/graveyard'] = {};
  flags['area/mountain'] = {};
  flags['area/crater'] = {};
  flags['area/goron'] = {};
  flags['area/zoras'] = {};
  flags['area/fountain'] = {};
  flags['area/deku'] = {};
  flags['area/dodongo'] = {};
  flags['area/jabujabu'] = {};
  flags['area/temple_forest'] = {};
  flags['area/temple_fire'] = {};
  flags['area/temple_water'] = {};
  flags['area/temple_shadow'] = {};
  flags['area/temple_spirit'] = {};
  flags['area/well'] = {};
  flags['area/ice_cavern'] = {};
  flags['area/training_grounds'] = {};
  flags['area/castle_ganon'] = {};
  var byte;

  byte = mem.u8[BASE + 0xA642];
  flags['area/mountain']['location/mountain.c_biggoron'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xA802];
  flags['area/gerudo']['location/gerudo.c_guard_2'] = (byte & BIT3) ? true : false;
  flags['area/gerudo']['location/gerudo.c_guard_1'] = (byte & BIT5) ? true : false;
  flags['area/gerudo']['location/gerudo.c_guard_3'] = (byte & BIT7) ? true : false;
  flags['area/gerudo']['location/gerudo.c_guard_4'] = (byte & BIT8) ? true : false;
  byte = mem.u8[BASE + 0xA877];
  flags['area/hyrule_field']['location/hyrule_field.c_hyrule_deku_salesman_grotto'] = (byte & BIT4) ? true : false;
  byte = mem.u8[BASE + 0xA902];
  flags['area/river']['location/river.c_zora_grotto_salesman_1'] = (byte & BIT1) ? true : false;
  flags['area/river']['location/river.c_zora_grotto_salesman_2'] = (byte & BIT2) ? true : false;
  byte = mem.u8[BASE + 0xA956];
  flags['area/meadow']['location/woods.c_deku_salesman_meadow_grotto_1'] = (byte & BIT1) ? true : false;
  flags['area/meadow']['location/woods.c_deku_salesman_meadow_grotto_2'] = (byte & BIT2) ? true : false;
  byte = mem.u8[BASE + 0xA973];
  flags['area/lake']['location/lake.c_grave_grotto_salesman_1'] = (byte & BIT2) ? true : false;
  flags['area/lake']['location/lake.c_grave_grotto_salesman_2'] = (byte & BIT5) ? true : false;
  flags['area/lake']['location/lake.c_grave_grotto_salesman_3'] = (byte & BIT7) ? true : false;
  byte = mem.u8[BASE + 0xA98E];
  flags['area/gerudo_valley']['location/gerudo_valley.c_gerudo_behind_carpenter_tent_grotto_salesman_1'] = (byte & BIT1) ? true : false;
  flags['area/gerudo_valley']['location/gerudo_valley.c_gerudo_behind_carpenter_tent_grotto_salesman_2'] = (byte & BIT2) ? true : false;
  byte = mem.u8[BASE + 0xAA1A];
  flags['area/woods']['location/woods.c_deku_salesman_grotto'] = (byte & BIT4) ? true : false;
  byte = mem.u8[BASE + 0xAA1B];
  flags['area/woods']['location/woods.c_deku_salesman_grotto_2'] = (byte & BIT5) ? true : false;
  byte = mem.u8[BASE + 0xAA8B];
  flags['area/crater']['location/mountain.c_crater_grotto_salesman_1'] = (byte & BIT2) ? true : false;
  flags['area/crater']['location/mountain.c_crater_grotto_salesman_2'] = (byte & BIT5) ? true : false;
  flags['area/crater']['location/mountain.c_crater_grotto_salesman_3'] = (byte & BIT7) ? true : false;
  byte = mem.u8[BASE + 0xAAC3];
  flags['area/goron']['location/goron.c_grotto_salesman_1'] = (byte & BIT2) ? true : false;
  flags['area/goron']['location/goron.c_grotto_salesman_2'] = (byte & BIT5) ? true : false;
  flags['area/goron']['location/goron.c_grotto_salesman_3'] = (byte & BIT7) ? true : false;
  byte = mem.u8[BASE + 0xAADF];
  flags['area/lonlon']['location/lonlon.c_grotto_deku_salesman_1'] = (byte & BIT2) ? true : false;
  flags['area/lonlon']['location/lonlon.c_grotto_deku_salesman_2'] = (byte & BIT5) ? true : false;
  flags['area/lonlon']['location/lonlon.c_grotto_deku_salesman_3'] = (byte & BIT7) ? true : false;
  byte = mem.u8[BASE + 0xAAFA];
  flags['area/colossus']['location/desert.c_colossus_grotto_salesman_1'] = (byte & BIT1) ? true : false;
  flags['area/colossus']['location/desert.c_colossus_grotto_salesman_2'] = (byte & BIT2) ? true : false;
  byte = mem.u8[BASE + 0xAB07];
  flags['area/kokiri']['location/kokiri.c_midos_house_1'] = (byte & BIT1) ? true : false;
  flags['area/kokiri']['location/kokiri.c_midos_house_2'] = (byte & BIT2) ? true : false;
  flags['area/kokiri']['location/kokiri.c_midos_house_3'] = (byte & BIT3) ? true : false;
  flags['area/kokiri']['location/kokiri.c_midos_house_4'] = (byte & BIT4) ? true : false;
  byte = mem.u8[BASE + 0xAC60];
  flags['area/kokiri']['location/kokiri.c_links_house_cow'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xAC98];
  flags['area/lonlon']['location/lonlon.c_cow_stables_1'] = (byte & BIT1) ? true : false;
  flags['area/lonlon']['location/lonlon.c_cow_stables_2'] = (byte & BIT2) ? true : false;
  byte = mem.u8[BASE + 0xACB4];
  flags['area/kakariko']['location/kakariko.c_impas_cow'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xACB7];
  flags['area/kakariko']['location/kakariko.c_cow_hp'] = (byte & BIT2) ? true : false;
  byte = mem.u8[BASE + 0xAD1C];
  flags['area/mountain']['location/mountain.c_summit_fairy'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xAD1D];
  flags['area/crater']['location/mountain.c_crater_fairy'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xAD1E];
  flags['area/castle_ganon_outside']['location/castle_town.c_ganon_fairy'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xAD6C];
  flags['area/crater']['location/mountain.c_crater_grotto'] = (byte & BIT3) ? true : false;
  byte = mem.u8[BASE + 0xAD6D];
  flags['area/meadow']['location/woods.c_wolfos_grotto'] = (byte & BIT2) ? true : false;
  flags['area/woods']['location/woods.c_bomb_grotto'] = (byte & BIT5) ? true : false;
  flags['area/mountain']['location/mountain.c_outside_goron_grotto'] = (byte & BIT8) ? true : false;
  byte = mem.u8[BASE + 0xAD6E];
  flags['area/kakariko']['location/kakariko.c_grotto'] = (byte & BIT1) ? true : false;
  flags['area/river']['location/river.c_zora_grotto'] = (byte & BIT2) ? true : false;
  flags['area/kakariko']['location/kakariko.c_redead_grotto'] = (byte & BIT3) ? true : false;
  flags['area/kokiri']['location/kokiri.c_storm_grotto'] = (byte & BIT5) ? true : false;
  byte = mem.u8[BASE + 0xAD6F];
  flags['area/hyrule_field']['location/hyrule_field.c_hyrule_north_grotto'] = (byte & BIT1) ? true : false;
  flags['area/hyrule_field']['location/hyrule_field.c_hyrule_forest_grotto'] = (byte & BIT3) ? true : false;
  flags['area/hyrule_field']['location/hyrule_field.c_hyrule_south_grotto'] = (byte & BIT4) ? true : false;
  byte = mem.u8[BASE + 0xAD78];
  flags['area/mountain']['location/mountain.c_grotto_cow'] = (byte & BIT1) ? true : false;
  flags['area/hyrule_field']['location/hyrule_field.c_hyrule_west_grotto_cow'] = (byte & BIT2) ? true : false;
  byte = mem.u8[BASE + 0xAD7B];
  flags['area/hyrule_field']['location/hyrule_field.c_diving_heart_piece_grotto'] = (byte & BIT2) ? true : false;
  byte = mem.u8[BASE + 0xAD8B];
  flags['area/graveyard']['location/kakariko.c_redead_grave'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xADA7];
  flags['area/graveyard']['location/kakariko.c_shield_grave'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xADC3];
  flags['area/graveyard']['location/kakariko.c_sun_song_chest'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xAE87];
  flags['area/graveyard']['location/kakariko.c_race_1'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xAE93];
  flags['area/kakariko']['location/kakariko.c_windmill_hp'] = (byte & BIT2) ? true : false;
  flags['area/graveyard']['location/kakariko.c_race_2'] = (byte & BIT8) ? true : false;
  byte = mem.u8[BASE + 0xAF00];
  flags['area/lonlon']['location/lonlon.c_cow_tower_2'] = (byte & BIT1) ? true : false;
  flags['area/lonlon']['location/lonlon.c_cow_tower_1'] = (byte & BIT2) ? true : false;
  byte = mem.u8[BASE + 0xAF03];
  flags['area/lonlon']['location/lonlon.c_hp'] = (byte & BIT2) ? true : false;
  byte = mem.u8[BASE + 0xAFC6];
  flags['area/graveyard']['location/kakariko.c_digging'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xAFC7];
  flags['area/graveyard']['location/kakariko.c_bean_hp'] = (byte & BIT5) ? true : false;
  byte = mem.u8[BASE + 0xAFE2];
  flags['area/river']['location/river.c_zora_hp_2'] = (byte & BIT4) ? true : false;
  byte = mem.u8[BASE + 0xAFE3];
  flags['area/river']['location/river.c_zora_bean_salesman'] = (byte & BIT2) ? true : false;
  flags['area/river']['location/river.c_zora_hp_1'] = (byte & BIT5) ? true : false;
  byte = mem.u8[BASE + 0xAFF3];
  flags['area/kokiri']['location/kokiri.c_sword'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xB02B];
  flags['area/lake']['location/lake.c_sun'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xB034];
  flags['area/lake']['location/lake.c_lab_roof'] = (byte & BIT7) ? true : false;
  byte = mem.u8[BASE + 0xB047];
  flags['area/zoras']['location/zoras.c_torch'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xB06D];
  flags['area/fountain']['location/zoras.c_underwater'] = (byte & BIT5) ? true : false;
  byte = mem.u8[BASE + 0xB06F];
  flags['area/fountain']['location/zoras.c_ice'] = (byte & BIT2) ? true : false;
  byte = mem.u8[BASE + 0xB07F];
  flags['area/gerudo_valley']['location/gerudo_valley.c_gerudo_hammer_rock'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xB088];
  flags['area/gerudo_valley']['location/gerudo_valley.c_gerudo_river_cow'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xB08B];
  flags['area/gerudo_valley']['location/gerudo_valley.c_gerudo_waterfall'] = (byte & BIT2) ? true : false;
  flags['area/gerudo_valley']['location/gerudo_valley.c_gerudo_crate'] = (byte & BIT3) ? true : false;
  byte = mem.u8[BASE + 0xB0AA];
  flags['area/woods']['location/woods.c_deku_salesman'] = (byte & BIT3) ? true : false;
  byte = mem.u8[BASE + 0xB0AB];
  flags['area/woods']['location/woods.c_deku_salesman_theater_2'] = (byte & BIT2) ? true : false;
  flags['area/woods']['location/woods.c_deku_salesman_theater_1'] = (byte & BIT3) ? true : false;
  byte = mem.u8[BASE + 0xB0B6];
  flags['area/temple_spirit']['location/temple_spirit.c_shield'] = (byte & BIT2) ? true : false;
  flags['area/temple_spirit']['location/temple_spirit_mq.c_mirror_shield'] = (byte & BIT2) ? true : false;
  flags['area/temple_spirit']['location/temple_spirit.c_gauntlets'] = (byte & BIT4) ? true : false;
  flags['area/temple_spirit']['location/temple_spirit_mq.c_gauntlets'] = (byte & BIT4) ? true : false;
  byte = mem.u8[BASE + 0xB0C2];
  flags['area/colossus']['location/desert.c_colossus_hp'] = (byte & BIT6) ? true : false;
  byte = mem.u8[BASE + 0xB0D3];
  flags['area/gerudo']['location/gerudo.c_rooftop'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xB0EF];
  flags['area/desert']['location/desert.c_chest'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xB0FB];
  flags['area/desert']['location/desert.c_bombchu_wasteland'] = (byte & BIT2) ? true : false;
  byte = mem.u8[BASE + 0xB127];
  flags['area/mountain']['location/mountain.c_outside_goron_chest'] = (byte & BIT2) ? true : false;
  byte = mem.u8[BASE + 0xB130];
  flags['area/mountain']['location/mountain.c_above_dodongo'] = (byte & BIT7) ? true : false;
  byte = mem.u8[BASE + 0xB14E];
  flags['area/crater']['location/mountain.c_magic_bean'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xB14F];
  flags['area/crater']['location/mountain.c_crater_wall'] = (byte & BIT3) ? true : false;
  byte = mem.u8[BASE + 0xB153];
  flags['area/crater']['location/mountain.c_crater_ladder_salesman'] = (byte & BIT7) ? true : false;
  byte = mem.u8[BASE + 0xB15F];
  flags['area/goron']['location/goron.c_maze_left'] = (byte & BIT1) ? true : false;
  flags['area/goron']['location/goron.c_maze_right'] = (byte & BIT2) ? true : false;
  flags['area/goron']['location/goron.c_maze_center'] = (byte & BIT3) ? true : false;
  byte = mem.u8[BASE + 0xB168];
  flags['area/goron']['location/goron.c_spinning_pot_hp'] = (byte & BIT8) ? true : false;
  byte = mem.u8[BASE + 0xB16B];
  flags['area/goron']['location/goron.c_medigoron'] = (byte & BIT2) ? true : false;
  byte = mem.u8[BASE + 0xB474];
  flags['area/lonlon']['location/lonlon.s_wall_child_night'] = (byte & BIT1) ? true : false;
  flags['area/lonlon']['location/lonlon.s_paddock_fence_child_night'] = (byte & BIT2) ? true : false;
  flags['area/lonlon']['location/lonlon.s_window_child_night'] = (byte & BIT3) ? true : false;
  flags['area/lonlon']['location/lonlon.s_tree_child_night'] = (byte & BIT4) ? true : false;
  byte = mem.u8[BASE + 0xB478];
  flags['area/crater']['location/mountain.s_crater_beanspot_child'] = (byte & BIT1) ? true : false;
  flags['area/mountain']['location/mountain.s_cave_entrance_beanspot_child'] = (byte & BIT2) ? true : false;
  flags['area/mountain']['location/mountain.s_bombable'] = (byte & BIT3) ? true : false;
  flags['area/mountain']['location/mountain.s_before_goron_hammer_rock_adult_night'] = (byte & BIT4) ? true : false;
  flags['area/mountain']['location/mountain.s_wall_hammer_rock_adult_night'] = (byte & BIT5) ? true : false;
  flags['area/goron']['location/goron.s_center_platform_adult'] = (byte & BIT6) ? true : false;
  flags['area/goron']['location/goron.s_maze_center_child'] = (byte & BIT7) ? true : false;
  flags['area/crater']['location/mountain.s_crater_box_child'] = (byte & BIT8) ? true : false;
  byte = mem.u8[BASE + 0xB47A];
  flags['area/woods']['location/woods.s_deku_salesman_beanspot_child'] = (byte & BIT1) ? true : false;
  flags['area/woods']['location/woods.s_mask_theater_beanspot_child'] = (byte & BIT2) ? true : false;
  flags['area/woods']['location/woods.s_deku_salesman_magic_bean_adult'] = (byte & BIT3) ? true : false;
  flags['area/meadow']['location/woods.s_labyrinth_adult_night'] = (byte & BIT4) ? true : false;
  byte = mem.u8[BASE + 0xB47B];
  flags['area/kokiri']['location/kokiri.s_beanspot_near_shop_child'] = (byte & BIT1) ? true : false;
  flags['area/kokiri']['location/kokiri.s_know_it_all_brothers_child_night'] = (byte & BIT2) ? true : false;
  flags['area/kokiri']['location/kokiri.s_twins_adult_night'] = (byte & BIT3) ? true : false;
  byte = mem.u8[BASE + 0xB47C];
  flags['area/gerudo_valley']['location/gerudo_valley.s_gerudo_river_beanspot_child'] = (byte & BIT1) ? true : false;
  flags['area/gerudo_valley']['location/gerudo_valley.s_gerudo_wood_plank_child_night'] = (byte & BIT2) ? true : false;
  flags['area/gerudo_valley']['location/gerudo_valley.s_gerudo_rock_near_carpenter_tent_adult_night'] = (byte & BIT3) ? true : false;
  flags['area/gerudo_valley']['location/gerudo_valley.s_gerudo_behind_carpenter_tent_adult_night'] = (byte & BIT4) ? true : false;
  byte = mem.u8[BASE + 0xB47D];
  flags['area/lake']['location/lake.s_beanspot_child'] = (byte & BIT1) ? true : false;
  flags['area/lake']['location/lake.s_near_firearrows_child_night'] = (byte & BIT2) ? true : false;
  flags['area/lake']['location/lake.s_behind_lab_child_night'] = (byte & BIT3) ? true : false;
  flags['area/lake']['location/lake.s_lab_box_adult'] = (byte & BIT4) ? true : false;
  flags['area/lake']['location/lake.s_dead_tree_adult_night'] = (byte & BIT5) ? true : false;
  byte = mem.u8[BASE + 0xB47F];
  flags['area/graveyard']['location/kakariko.s_graveyard_beanspot_child_night'] = (byte & BIT1) ? true : false;
  flags['area/kakariko']['location/kakariko.s_near_gate_child_night'] = (byte & BIT2) ? true : false;
  flags['area/kakariko']['location/kakariko.s_tower_child_night'] = (byte & BIT3) ? true : false;
  flags['area/kakariko']['location/kakariko.s_construction_site_child_night'] = (byte & BIT4) ? true : false;
  flags['area/kakariko']['location/kakariko.s_skulltula_house_child_night'] = (byte & BIT5) ? true : false;
  flags['area/kakariko']['location/kakariko.s_tree_child'] = (byte & BIT6) ? true : false;
  flags['area/kakariko']['location/kakariko.s_impas_house_roof_adult_night'] = (byte & BIT7) ? true : false;
  flags['area/graveyard']['location/kakariko.s_graveyard_royal_grave_child_night'] = (byte & BIT8) ? true : false;
  byte = mem.u8[BASE + 0xB483];
  flags['area/gerudo']['location/gerudo.s_horseback_archery_target_adult_night'] = (byte & BIT1) ? true : false;
  flags['area/gerudo']['location/gerudo.s_rooftop_adult_night'] = (byte & BIT2) ? true : false;
  byte = mem.u8[BASE + 0xB4AA];
  flags['area/zoras']['location/zoras.c_diving'] = (byte & BIT1) ? true : false;
  byte = mem.u8[BASE + 0xB4AB];
  flags['area/lake']['location/lake.c_bottle_zora'] = (byte & BIT2) ? true : false;
  flags['area/goron']['location/goron.c_darunia'] = (byte & BIT7) ? true : false;
  byte = mem.u8[BASE + 0xB4AD];
  flags['area/hyrule_field']['location/hyrule_field.c_ocarina_of_time'] = (byte & BIT4) ? true : false;
  byte = mem.u8[BASE + 0xB4AF];
  flags['area/meadow']['location/woods.c_warp'] = (byte & BIT1) ? true : false;
  flags['area/crater']['location/mountain.c_warp'] = (byte & BIT2) ? true : false;
  flags['area/ice_cavern']['location/ice_cavern.c_sheik'] = (byte & BIT3) ? true : false;
  flags['area/ice_cavern']['location/ice_cavern_mq.c_sheik'] = (byte & BIT3) ? true : false;
  flags['area/temple_time']['location/castle_town.c_warp'] = (byte & BIT6) ? true : false;
  flags['area/meadow']['location/woods.c_saria'] = (byte & BIT8) ? true : false;
  byte = mem.u8[BASE + 0xB4B7];
  flags['area/gerudo']['location/gerudo.c_fortress_clear'] = (byte & (BIT1 | BIT2 | BIT3 | BIT4) == 0xF) ? true : false;
  byte = mem.u8[BASE + 0xB4BD];
  flags['area/woods']['location/kokiri.c_saria_ocarina'] = (byte & BIT2) ? true : false;
  flags['area/temple_time']['location/castle_town.c_light_arrows'] = (byte & BIT5) ? true : false;
  byte = mem.u8[BASE + 0xB4BE];
  flags['area/kakariko']['location/kakariko.c_skulltula_10'] = (byte & BIT3) ? true : false;
  flags['area/kakariko']['location/kakariko.c_skulltula_20'] = (byte & BIT4) ? true : false;
  flags['area/kakariko']['location/kakariko.c_skulltula_30'] = (byte & BIT5) ? true : false;
  flags['area/kakariko']['location/kakariko.c_skulltula_40'] = (byte & BIT6) ? true : false;
  flags['area/kakariko']['location/kakariko.c_skulltula_50'] = (byte & BIT7) ? true : false;
  byte = mem.u8[BASE + 0xB4C2];
  flags['area/fountain']['location/zoras.c_fairy'] = (byte & BIT1) ? true : false;
  flags['area/castle']['location/castle_town.c_hyrule_fairy'] = (byte & BIT2) ? true : false;
  flags['area/colossus']['location/desert.c_colossus_fairy'] = (byte & BIT3) ? true : false;
  flags['area/castle_town']['location/castle_town.c_chest_game'] = (byte & BIT4) ? true : false;
  flags['area/woods']['location/woods.c_shooting'] = (byte & BIT6) ? true : false;
  flags['area/woods']['location/woods.c_deku_theater_1'] = (byte & BIT7) ? true : false;
  flags['area/woods']['location/woods.c_deku_theater_2'] = (byte & BIT8) ? true : false;
  byte = mem.u8[BASE + 0xB4C3];
  flags['area/lake']['location/lake.c_lab_dive'] = (byte & BIT1) ? true : false;
  flags['area/castle_town']['location/castle_town.c_bowling_1'] = (byte & BIT2) ? true : false;
  flags['area/castle_town']['location/castle_town.c_bowling_2'] = (byte & BIT3) ? true : false;
  flags['area/kakariko']['location/kakariko.c_man_roof'] = (byte & BIT6) ? true : false;
  flags['area/woods']['location/woods.c_skull_kid'] = (byte & BIT7) ? true : false;
  flags['area/woods']['location/woods.c_memory_game'] = (byte & BIT8) ? true : false;
  byte = mem.u8[BASE + 0xB4C4];
  flags['area/kakariko']['location/kakariko.c_anju_adult'] = (byte & BIT5) ? true : false;
  byte = mem.u8[BASE + 0xB4E8];
  flags['area/goron']['location/goron.c_little_link'] = (byte & BIT2) ? true : false;
  byte = mem.u8[BASE + 0xB4EA];
  flags['area/goron']['location/goron.c_hot_rodder'] = (byte & BIT7) ? true : false;
  byte = mem.u8[BASE + 0xB475];
  flags['area/hyrule_field']['location/hyrule_field.s_hyrule_west_grotto'] = (byte & BIT1) ? true : false;
  flags['area/hyrule_field']['location/hyrule_field.s_hyrule_north_east_grotto'] = (byte & BIT2) ? true : false;
  byte = mem.u8[BASE + 0xB479];
  flags['area/castle_ganon_outside']['location/castle_town.s_near_ganon_fairy_adult'] = (byte & BIT1) ? true : false;
  flags['area/castle']['location/castle_town.s_storm_grotto_child'] = (byte & BIT2) ? true : false;
  flags['area/castle']['location/castle_town.s_tree_child'] = (byte & BIT3) ? true : false;
  flags['area/town_entrance']['location/castle_town.s_pot_room_child'] = (byte & BIT4) ? true : false;
  byte = mem.u8[BASE + 0xB47E];
  flags['area/river']['location/river.s_zora_ladder_child_night'] = (byte & BIT1) ? true : false;
  flags['area/river']['location/river.s_zora_tree_child'] = (byte & BIT2) ? true : false;
  flags['area/fountain']['location/zoras.s_wall_child_night'] = (byte & BIT3) ? true : false;
  flags['area/river']['location/river.s_zora_wall2_adult_night'] = (byte & BIT4) ? true : false;
  flags['area/river']['location/river.s_zora_wall1_adult_night'] = (byte & BIT5) ? true : false;
  flags['area/fountain']['location/zoras.s_fairy_hidden_cave_adult_night'] = (byte & BIT6) ? true : false;
  flags['area/zoras']['location/zoras.s_wall_ice_adult_night'] = (byte & BIT7) ? true : false;
  flags['area/fountain']['location/zoras.s_tree_child'] = (byte & BIT8) ? true : false;
  byte = mem.u8[BASE + 0xB482];
  flags['area/colossus']['location/desert.s_beanspot_child'] = (byte & BIT1) ? true : false;
  flags['area/desert']['location/desert.s_fortress_adult'] = (byte & BIT2) ? true : false;
  flags['area/colossus']['location/desert.s_magic_bean_adult_night'] = (byte & BIT3) ? true : false;
  flags['area/colossus']['location/desert.s_palm_tree_adult_night'] = (byte & BIT4) ? true : false;
  byte = mem.u8[BASE + 0xB48F];
  flags['area/town_entrance']['location/castle_town.c_poes'] = (byte >= 0x64) ? true : false;
  byte = mem.u8[BASE + 0xB492];
  flags['area/lake']['location/lake.c_fishing_child'] = (byte & BIT3) ? true : false;
  flags['area/lake']['location/lake.c_fishing_adult'] = (byte & BIT4) ? true : false;
  byte = mem.u8[BASE + 0xB4A7];
  flags['area/castle']['location/castle_town.c_maron'] = (byte & BIT3) ? true : false;
  byte = mem.u8[BASE + 0xB4AE];
  flags['area/lonlon']['location/lonlon.c_maron_song'] = (byte & BIT1) ? true : false;
  flags['area/castle']['location/castle_town.c_zelda'] = (byte & BIT2) ? true : false;
  flags['area/graveyard']['location/kakariko.c_sun_song'] = (byte & BIT3) ? true : false;
  flags['area/kakariko']['location/kakariko.c_song_storm'] = (byte & BIT4) ? true : false;
  var items = findItemLocations();
  if (items && !flags['area/graveyard']['location/kakariko.c_sun_song']) {
    for (var i = items; i < items + 0x1000; i += 0x8) {
      var loc = mem.u32[i];
      if (loc == 0x00FF0529) {
        var item = mem.u16[i+4];
        var byte = mem.u32[SAVE + 0xA4];
        if (item == 0xBB && (byte & BIT7)) flags['area/graveyard']['location/kakariko.c_sun_song'] = true;
        else if (item == 0xBC && (byte & BIT8)) flags['area/graveyard']['location/kakariko.c_sun_song'] = true;
        else if (item == 0xBD && (byte & BIT9)) flags['area/graveyard']['location/kakariko.c_sun_song'] = true;
        else if (item == 0xBE && (byte & BIT10)) flags['area/graveyard']['location/kakariko.c_sun_song'] = true;
        else if (item == 0xBF && (byte & BIT11)) flags['area/graveyard']['location/kakariko.c_sun_song'] = true;
        else if (item == 0xC0 && (byte & BIT12)) flags['area/graveyard']['location/kakariko.c_sun_song'] = true;
        else if (item == 0xC1 && (byte & BIT13)) flags['area/graveyard']['location/kakariko.c_sun_song'] = true;
        else if (item == 0xC2 && (byte & BIT14)) flags['area/graveyard']['location/kakariko.c_sun_song'] = true;
        else if (item == 0xC3 && (byte & BIT15)) flags['area/graveyard']['location/kakariko.c_sun_song'] = true;
        else if (item == 0xC4 && (byte & BIT16)) flags['area/graveyard']['location/kakariko.c_sun_song'] = true;
        else if (item == 0xC5 && (byte & BIT17)) flags['area/graveyard']['location/kakariko.c_sun_song'] = true;
        else if (item == 0xC6 && (byte & BIT18)) flags['area/graveyard']['location/kakariko.c_sun_song'] = true;
      }
      if (loc >= 0x00FF0529) break;
    }
  }
  byte = mem.u8[BASE + 0xB4B8];
  flags['area/hyrule_field']['location/hyrule_field.c_song_of_time'] = (byte & BIT2) ? true : false;
  flags['area/kakariko']['location/kakariko.c_warp'] = (byte & BIT3) ? true : false;
  flags['area/colossus']['location/desert.c_warp_spirit'] = (byte & BIT5) ? true : false;
  byte = mem.u8[BASE + 0xB4BF];
  flags['area/river']['location/river.c_frog_game'] = (byte & BIT1) ? true : false;
  flags['area/river']['location/river.c_frog_rain'] = (byte & BIT7) ? true : false;
  byte = mem.u8[BASE + 0xB4C0];
  flags['area/kakariko']['location/kakariko.c_anju_chickens'] = (byte & BIT5) ? true : false;
  flags['area/castle_town']['location/castle_town.c_child_shooting'] = (byte & BIT6) ? true : false;
  flags['area/kakariko']['location/kakariko.c_adult_shooting'] = (byte & BIT7) ? true : false;
  flags['area/gerudo']['location/gerudo.c_archer_2'] = (byte & BIT8) ? true : false;
  byte = mem.u8[BASE + 0xB4C1];
  flags['area/lonlon']['location/lonlon.c_talon_chicken'] = (byte & BIT3) ? true : false;
  byte = mem.u8[BASE + 0xB4EE];
  flags['area/zoras']['location/zoras.c_king_zora'] = (byte & BIT2) ? true : false;
  byte = mem.u8[BASE + 0xB4FB];
  flags['area/gerudo']['location/gerudo.c_archer_1'] = (byte & BIT1) ? true : false;
  flags['area/castle_town']['location/castle_town.c_dog'] = (byte & BIT2) ? true : false;
  byte = mem.u8[BASE + 0xA88C];
  flags['area/deku']['location/deku.c_gohma'] = (byte & BIT8) ? true : false;
  flags['area/deku']['location/deku_mq.c_gohma'] = (byte & BIT8) ? true : false;
  byte = mem.u8[BASE + 0xA8A8];
  flags['area/dodongo']['location/dodongo.c_dodongo'] = (byte & BIT8) ? true : false;
  flags['area/dodongo']['location/dodongo_mq.c_dodongo'] = (byte & BIT8) ? true : false;
  byte = mem.u8[BASE + 0xA8C4];
  flags['area/jabujabu']['location/jabujabu.c_barinade'] = (byte & BIT8) ? true : false;
  flags['area/jabujabu']['location/jabujabu_mq.c_barinade'] = (byte & BIT8) ? true : false;
  byte = mem.u8[BASE + 0xA8E0];
  flags['area/temple_forest']['location/temple_forest.c_phantomganon'] = (byte & BIT8) ? true : false;
  flags['area/temple_forest']['location/temple_forest_mq.c_phantomganon'] = (byte & BIT8) ? true : false;
  byte = mem.u8[BASE + 0xA8FC];
  flags['area/temple_fire']['location/temple_fire.c_volvagia'] = (byte & BIT8) ? true : false;
  flags['area/temple_fire']['location/temple_fire_mq.c_volvagia'] = (byte & BIT8) ? true : false;
  byte = mem.u8[BASE + 0xA918];
  flags['area/temple_water']['location/temple_water.c_morpha'] = (byte & BIT8) ? true : false;
  flags['area/temple_water']['location/temple_water_mq.c_morpha'] = (byte & BIT8) ? true : false;
  byte = mem.u8[BASE + 0xA934];
  flags['area/temple_spirit']['location/temple_spirit.c_twinrova'] = (byte & BIT8) ? true : false;
  flags['area/temple_spirit']['location/temple_spirit_mq.c_twinrova'] = (byte & BIT8) ? true : false;
  byte = mem.u8[BASE + 0xA950];
  flags['area/temple_shadow']['location/temple_shadow.c_bongobongo'] = (byte & BIT8) ? true : false;
  flags['area/temple_shadow']['location/temple_shadow_mq.c_bongobongo'] = (byte & BIT8) ? true : false;
  if (prevDungeonTypes['area/deku'] && prevDungeonTypes['area/deku'].type == 'v') {
    byte = mem.u8[BASE + 0xA6A7];
    flags['area/deku']['location/deku.c_slingshot'] = (byte & BIT2) ? true : false;
    flags['area/deku']['location/deku.c_compass'] = (byte & BIT3) ? true : false;
    flags['area/deku']['location/deku.c_lobby'] = (byte & BIT4) ? true : false;
    flags['area/deku']['location/deku.c_basement'] = (byte & BIT5) ? true : false;
    flags['area/deku']['location/deku.c_slingshot_side'] = (byte & BIT6) ? true : false;
    flags['area/deku']['location/deku.c_compass_side'] = (byte & BIT7) ? true : false;
    byte = mem.u8[BASE + 0xB46F];
    flags['area/deku']['location/deku.s_bombable_behind_web_child'] = (byte & BIT1) ? true : false;
    flags['area/deku']['location/deku.s_basement_metal_gate_child'] = (byte & BIT2) ? true : false;
    flags['area/deku']['location/deku.s_basement_vines_child'] = (byte & BIT3) ? true : false;
    flags['area/deku']['location/deku.s_3f_compass_side_child'] = (byte & BIT4) ? true : false;
  }
  else if (prevDungeonTypes['area/deku'] && prevDungeonTypes['area/deku'].type == 'mq') {
    byte = mem.u8[BASE + 0xA6A7];
    flags['area/deku']['location/deku_mq.c_after_log'] = (byte & BIT1) ? true : false;
    flags['area/deku']['location/deku_mq.c_compass'] = (byte & BIT2) ? true : false;
    flags['area/deku']['location/deku_mq.c_slingshot_back'] = (byte & BIT3) ? true : false;
    flags['area/deku']['location/deku_mq.c_lobby'] = (byte & BIT4) ? true : false;
    flags['area/deku']['location/deku_mq.c_basement'] = (byte & BIT5) ? true : false;
    flags['area/deku']['location/deku_mq.c_before_log'] = (byte & BIT6) ? true : false;
    flags['area/deku']['location/deku_mq.c_slingshot'] = (byte & BIT7) ? true : false;
    byte = mem.u8[BASE + 0xA6A7];
    flags['area/deku']['location/deku_mq.c_basement_salesman'] = (byte & BIT6) ? true : false;
    byte = mem.u8[BASE + 0xB46F];
    flags['area/deku']['location/deku_mq.s_basement_back_room_child'] = (byte & BIT1) ? true : false;
    flags['area/deku']['location/deku_mq.s_crate_near_map_child'] = (byte & BIT2) ? true : false;
    flags['area/deku']['location/deku_mq.s_basement_grave_ceiling_child'] = (byte & BIT3) ? true : false;
    flags['area/deku']['location/deku_mq.s_2f_compass_side_child'] = (byte & BIT4) ? true : false;
  }
  if (prevDungeonTypes['area/dodongo'] && prevDungeonTypes['area/dodongo'].type == 'v') {
    byte = mem.u8[BASE + 0xA6C2];
    flags['area/dodongo']['location/dodongo.c_map'] = (byte & BIT1) ? true : false;
    flags['area/dodongo']['location/dodongo.c_end_bridge'] = (byte & BIT3) ? true : false;
    byte = mem.u8[BASE + 0xA6C3];
    flags['area/dodongo']['location/dodongo.c_bomb_bag'] = (byte & BIT5) ? true : false;
    flags['area/dodongo']['location/dodongo.c_compass'] = (byte & BIT6) ? true : false;
    flags['area/dodongo']['location/dodongo.c_bomb_flower_platform'] = (byte & BIT7) ? true : false;
    byte = mem.u8[BASE + 0xA6D3];
    flags['area/dodongo']['location/dodongo.c_near_bomb_bag_salesman_1'] = (byte & BIT2) ? true : false;
    flags['area/dodongo']['location/dodongo.c_east_corridor_salesman'] = (byte & BIT3) ? true : false;
    flags['area/dodongo']['location/dodongo.c_near_bomb_bag_salesman_2'] = (byte & BIT5) ? true : false;
    flags['area/dodongo']['location/dodongo.c_lobby_salesman'] = (byte & BIT6) ? true : false;
    byte = mem.u8[BASE + 0xA89F];
    flags['area/dodongo']['location/dodongo.c_chest_above_dodongo'] = (byte & BIT1) ? true : false;
    byte = mem.u8[BASE + 0xB46E];
    flags['area/dodongo']['location/dodongo.s_big_staircase_vines'] = (byte & BIT1) ? true : false;
    flags['area/dodongo']['location/dodongo.s_east_corridor_scarecrow_adult'] = (byte & BIT2) ? true : false;
    flags['area/dodongo']['location/dodongo.s_above_big_staircase_adult'] = (byte & BIT3) ? true : false;
    flags['area/dodongo']['location/dodongo.s_near_boss_bombable'] = (byte & BIT4) ? true : false;
    flags['area/dodongo']['location/dodongo.s_east_corridor_bombable'] = (byte & BIT5) ? true : false;
  }
  else if (prevDungeonTypes['area/dodongo'] && prevDungeonTypes['area/dodongo'].type == 'mq') {
    byte = mem.u8[BASE + 0xA6C3];
    flags['area/dodongo']['location/dodongo_mq.c_map'] = (byte & BIT1) ? true : false;
    flags['area/dodongo']['location/dodongo_mq.c_under_grave'] = (byte & BIT2) ? true : false;
    flags['area/dodongo']['location/dodongo_mq.c_gohma_larva_room'] = (byte & BIT3) ? true : false;
    flags['area/dodongo']['location/dodongo_mq.c_torch_puzzle_room'] = (byte & BIT4) ? true : false;
    flags['area/dodongo']['location/dodongo_mq.c_bomb_bag'] = (byte & BIT5) ? true : false;
    flags['area/dodongo']['location/dodongo_mq.c_compass'] = (byte & BIT6) ? true : false;
    byte = mem.u8[BASE + 0xA6D2];
    flags['area/dodongo']['location/dodongo_mq.c_1f_right'] = (byte & BIT1) ? true : false;
    byte = mem.u8[BASE + 0xA6D3];
    flags['area/dodongo']['location/dodongo_mq.c_main_room_salesman_1'] = (byte & BIT3) ? true : false;
    flags['area/dodongo']['location/dodongo_mq.c_main_room_salesman_2'] = (byte & BIT5) ? true : false;
    flags['area/dodongo']['location/dodongo_mq.c_above_stairs'] = (byte & BIT6) ? true : false;
    byte = mem.u8[BASE + 0xA89F];
    flags['area/dodongo']['location/dodongo_mq.c_chest_above_dodongo'] = (byte & BIT1) ? true : false;
    byte = mem.u8[BASE + 0xB46E];
    flags['area/dodongo']['location/dodongo_mq.s_back_area'] = (byte & BIT1) ? true : false;
    flags['area/dodongo']['location/dodongo_mq.s_scrub_poe_room'] = (byte & BIT2) ? true : false;
    flags['area/dodongo']['location/dodongo_mq.s_upper_lizalfos_room'] = (byte & BIT3) ? true : false;
    flags['area/dodongo']['location/dodongo_mq.s_time_block_room'] = (byte & BIT4) ? true : false;
    flags['area/dodongo']['location/dodongo_mq.s_gohma_larva_skulltula'] = (byte & BIT5) ? true : false;
  }
  if (prevDungeonTypes['area/jabujabu'] && prevDungeonTypes['area/jabujabu'].type == 'v') {
    byte = mem.u8[BASE + 0xA6DF];
    flags['area/jabujabu']['location/jabujabu.c_boomerang'] = (byte & BIT2) ? true : false;
    flags['area/jabujabu']['location/jabujabu.c_map'] = (byte & BIT3) ? true : false;
    flags['area/jabujabu']['location/jabujabu.c_compass'] = (byte & BIT5) ? true : false;
    byte = mem.u8[BASE + 0xA6EF];
    flags['area/jabujabu']['location/jabujabu.c_elevator_dive_salesman'] = (byte & BIT2) ? true : false;
    byte = mem.u8[BASE + 0xB46D];
    flags['area/jabujabu']['location/jabujabu.s_b1_ruto1_child'] = (byte & BIT1) ? true : false;
    flags['area/jabujabu']['location/jabujabu.s_b1_ruto2_child'] = (byte & BIT2) ? true : false;
    flags['area/jabujabu']['location/jabujabu.s_1f_near_boss_child'] = (byte & BIT3) ? true : false;
    flags['area/jabujabu']['location/jabujabu.s_b1_rising_water_child'] = (byte & BIT4) ? true : false;
  }
  else if (prevDungeonTypes['area/jabujabu'] && prevDungeonTypes['area/jabujabu'].type == 'mq') {
    byte = mem.u8[BASE + 0xA6DE];
    flags['area/jabujabu']['location/jabujabu_mq.c_basement_north_chest'] = (byte & BIT1) ? true : false;
    flags['area/jabujabu']['location/jabujabu_mq.c_like_like_chest'] = (byte & BIT2) ? true : false;
    flags['area/jabujabu']['location/jabujabu_mq.c_near_boss'] = (byte & BIT3) ? true : false;
    byte = mem.u8[BASE + 0xA6DF];
    flags['area/jabujabu']['location/jabujabu_mq.c_compass'] = (byte & BIT1) ? true : false;
    flags['area/jabujabu']['location/jabujabu_mq.c_boomerang_room_small_chest'] = (byte & BIT2) ? true : false;
    flags['area/jabujabu']['location/jabujabu_mq.c_second_room_lower_chest'] = (byte & BIT3) ? true : false;
    flags['area/jabujabu']['location/jabujabu_mq.c_map'] = (byte & BIT4) ? true : false;
    flags['area/jabujabu']['location/jabujabu_mq.c_basement_south_chest'] = (byte & BIT5) ? true : false;
    flags['area/jabujabu']['location/jabujabu_mq.c_entry_side_chest'] = (byte & BIT6) ? true : false;
    flags['area/jabujabu']['location/jabujabu_mq.c_boomerang_chest'] = (byte & BIT7) ? true : false;
    flags['area/jabujabu']['location/jabujabu_mq.c_second_room_upper'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xA6E8];
    flags['area/jabujabu']['location/jabujabu_mq.c_cow'] = (byte & BIT1) ? true : false;
    byte = mem.u8[BASE + 0xB46D];
    flags['area/jabujabu']['location/jabujabu_mq.s_boomerang_room'] = (byte & BIT1) ? true : false;
    flags['area/jabujabu']['location/jabujabu_mq.s_near_boss_gs'] = (byte & BIT2) ? true : false;
    flags['area/jabujabu']['location/jabujabu_mq.s_electric_worm_room'] = (byte & BIT3) ? true : false;
    flags['area/jabujabu']['location/jabujabu_mq.s_invisible_enemies_room'] = (byte & BIT4) ? true : false;
  }
  if (prevDungeonTypes['area/temple_forest'] && prevDungeonTypes['area/temple_forest'].type == 'v') {
    byte = mem.u8[BASE + 0xA6FA];
    flags['area/temple_forest']['location/temple_forest.c_well'] = (byte & BIT2) ? true : false;
    flags['area/temple_forest']['location/temple_forest.c_near_boss'] = (byte & BIT4) ? true : false;
    flags['area/temple_forest']['location/temple_forest.c_bow'] = (byte & BIT5) ? true : false;
    flags['area/temple_forest']['location/temple_forest.c_poe_red'] = (byte & BIT6) ? true : false;
    flags['area/temple_forest']['location/temple_forest.c_boss_key'] = (byte & BIT7) ? true : false;
    flags['area/temple_forest']['location/temple_forest.c_poe_blue'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xA6FB];
    flags['area/temple_forest']['location/temple_forest.c_behind_lobby'] = (byte & BIT1) ? true : false;
    flags['area/temple_forest']['location/temple_forest.c_map'] = (byte & BIT2) ? true : false;
    flags['area/temple_forest']['location/temple_forest.c_floormaster'] = (byte & BIT3) ? true : false;
    flags['area/temple_forest']['location/temple_forest.c_entrance'] = (byte & BIT4) ? true : false;
    flags['area/temple_forest']['location/temple_forest.c_block_push'] = (byte & BIT5) ? true : false;
    flags['area/temple_forest']['location/temple_forest.c_outside_hookshot'] = (byte & BIT6) ? true : false;
    flags['area/temple_forest']['location/temple_forest.c_falling_room'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xB46C];
    flags['area/temple_forest']['location/temple_forest.s_outside_hookshot_adult'] = (byte & BIT1) ? true : false;
    flags['area/temple_forest']['location/temple_forest.s_entrance_adult'] = (byte & BIT2) ? true : false;
    flags['area/temple_forest']['location/temple_forest.s_pillars_adult'] = (byte & BIT3) ? true : false;
    flags['area/temple_forest']['location/temple_forest.s_lobby_adult'] = (byte & BIT4) ? true : false;
    flags['area/temple_forest']['location/temple_forest.s_near_boss_adult'] = (byte & BIT5) ? true : false;
  }
  else if (prevDungeonTypes['area/temple_forest'] && prevDungeonTypes['area/temple_forest'].type == 'mq') {
    byte = mem.u8[BASE + 0xA6FA];
    flags['area/temple_forest']['location/temple_forest_mq.c_well_chest'] = (byte & BIT2) ? true : false;
    flags['area/temple_forest']['location/temple_forest_mq.c_near_boss'] = (byte & BIT4) ? true : false;
    flags['area/temple_forest']['location/temple_forest_mq.c_bow'] = (byte & BIT5) ? true : false;
    flags['area/temple_forest']['location/temple_forest_mq.c_map'] = (byte & BIT6) ? true : false;
    flags['area/temple_forest']['location/temple_forest_mq.c_boss_key'] = (byte & BIT7) ? true : false;
    flags['area/temple_forest']['location/temple_forest_mq.c_compass'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xA6FB];
    flags['area/temple_forest']['location/temple_forest_mq.c_behind_lobby'] = (byte & BIT1) ? true : false;
    flags['area/temple_forest']['location/temple_forest_mq.c_ne_outdoors_lower'] = (byte & BIT2) ? true : false;
    flags['area/temple_forest']['location/temple_forest_mq.c_redead_chest'] = (byte & BIT3) ? true : false;
    flags['area/temple_forest']['location/temple_forest_mq.c_entrance'] = (byte & BIT4) ? true : false;
    flags['area/temple_forest']['location/temple_forest_mq.c_ne_outdoors_upper'] = (byte & BIT6) ? true : false;
    flags['area/temple_forest']['location/temple_forest_mq.c_falling_room'] = (byte & BIT7) ? true : false;
    byte = mem.u8[BASE + 0xB46C];
    flags['area/temple_forest']['location/temple_forest_mq.s_outdoor_east_adult'] = (byte & BIT1) ? true : false;
    flags['area/temple_forest']['location/temple_forest_mq.s_first_hallway_adult'] = (byte & BIT2) ? true : false;
    flags['area/temple_forest']['location/temple_forest_mq.s_outdoor_west_adult'] = (byte & BIT3) ? true : false;
    flags['area/temple_forest']['location/temple_forest_mq.s_well_adult'] = (byte & BIT4) ? true : false;
    flags['area/temple_forest']['location/temple_forest_mq.s_block_push_room_adult'] = (byte & BIT5) ? true : false;
  }
  if (prevDungeonTypes['area/temple_fire'] && prevDungeonTypes['area/temple_fire'].type == 'v') {
    byte = mem.u8[BASE + 0xA716];
    flags['area/temple_fire']['location/temple_fire.c_boulder_maze_side'] = (byte & BIT1) ? true : false;
    flags['area/temple_fire']['location/temple_fire.c_highest_goron'] = (byte & BIT2) ? true : false;
    flags['area/temple_fire']['location/temple_fire.c_map'] = (byte & BIT3) ? true : false;
    flags['area/temple_fire']['location/temple_fire.c_boulder_maze_bomb'] = (byte & BIT4) ? true : false;
    flags['area/temple_fire']['location/temple_fire.c_boss_key'] = (byte & BIT5) ? true : false;
    flags['area/temple_fire']['location/temple_fire.c_scarecrow'] = (byte & BIT6) ? true : false;
    byte = mem.u8[BASE + 0xA717];
    flags['area/temple_fire']['location/temple_fire.c_dancer'] = (byte & BIT1) ? true : false;
    flags['area/temple_fire']['location/temple_fire.c_near_boss'] = (byte & BIT2) ? true : false;
    flags['area/temple_fire']['location/temple_fire.c_big_lava_bomb'] = (byte & BIT3) ? true : false;
    flags['area/temple_fire']['location/temple_fire.c_boulder_maze_lower'] = (byte & BIT4) ? true : false;
    flags['area/temple_fire']['location/temple_fire.c_big_lava_open'] = (byte & BIT5) ? true : false;
    flags['area/temple_fire']['location/temple_fire.c_hammer'] = (byte & BIT6) ? true : false;
    flags['area/temple_fire']['location/temple_fire.c_boulder_maze_upper'] = (byte & BIT7) ? true : false;
    flags['area/temple_fire']['location/temple_fire.c_compass'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xB473];
    flags['area/temple_fire']['location/temple_fire.s_big_lava_time_block_adult'] = (byte & BIT1) ? true : false;
    flags['area/temple_fire']['location/temple_fire.s_near_boss_key_adult'] = (byte & BIT2) ? true : false;
    flags['area/temple_fire']['location/temple_fire.s_boulder_maze_bombable_adult'] = (byte & BIT3) ? true : false;
    flags['area/temple_fire']['location/temple_fire.s_boulder_maze_scarecrow2_adult'] = (byte & BIT4) ? true : false;
    flags['area/temple_fire']['location/temple_fire.s_boulder_maze_scarecrow1_adult'] = (byte & BIT5) ? true : false;
  }
  else if (prevDungeonTypes['area/temple_fire'] && prevDungeonTypes['area/temple_fire'].type == 'mq') {
    byte = mem.u8[BASE + 0xA716];
    flags['area/temple_fire']['location/temple_fire_mq.c_boulder_maze_side'] = (byte & BIT1) ? true : false;
    flags['area/temple_fire']['location/temple_fire_mq.c_compass'] = (byte & BIT4) ? true : false;
    flags['area/temple_fire']['location/temple_fire_mq.c_map'] = (byte & BIT5) ? true : false;
    byte = mem.u8[BASE + 0xA717];
    flags['area/temple_fire']['location/temple_fire_mq.c_megaton_hammer'] = (byte & BIT1) ? true : false;
    flags['area/temple_fire']['location/temple_fire_mq.c_big_lava_bomb'] = (byte & BIT2) ? true : false;
    flags['area/temple_fire']['location/temple_fire_mq.c_map_room_small_chest'] = (byte & BIT3) ? true : false;
    flags['area/temple_fire']['location/temple_fire_mq.c_boulder_maze_lower'] = (byte & BIT4) ? true : false;
    flags['area/temple_fire']['location/temple_fire_mq.c_boss_key'] = (byte & BIT5) ? true : false;
    flags['area/temple_fire']['location/temple_fire_mq.c_west_tower_top'] = (byte & BIT6) ? true : false;
    flags['area/temple_fire']['location/temple_fire_mq.c_boulder_maze_upper'] = (byte & BIT7) ? true : false;
    flags['area/temple_fire']['location/temple_fire_mq.c_chest_near_boss'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xA720];
    flags['area/temple_fire']['location/temple_fire_mq.c_freestanding_key'] = (byte & BIT5) ? true : false;
    byte = mem.u8[BASE + 0xB473];
    flags['area/temple_fire']['location/temple_fire_mq.s_big_lava_adult'] = (byte & BIT1) ? true : false;
    flags['area/temple_fire']['location/temple_fire_mq.s_above_fire_wall_maze_adult'] = (byte & BIT2) ? true : false;
    flags['area/temple_fire']['location/temple_fire_mq.s_east_tower_top_adult'] = (byte & BIT3) ? true : false;
    flags['area/temple_fire']['location/temple_fire_mq.s_fire_wall_maze_center_adult'] = (byte & BIT4) ? true : false;
    flags['area/temple_fire']['location/temple_fire_mq.s_fire_wall_maze_side_adult'] = (byte & BIT5) ? true : false;
  }
  if (prevDungeonTypes['area/ice_cavern'] && prevDungeonTypes['area/ice_cavern'].type == 'v') {
    byte = mem.u8[BASE + 0xA7A3];
    flags['area/ice_cavern']['location/ice_cavern.c_map'] = (byte & BIT1) ? true : false;
    flags['area/ice_cavern']['location/ice_cavern.c_compass'] = (byte & BIT2) ? true : false;
    flags['area/ice_cavern']['location/ice_cavern.c_boots'] = (byte & BIT3) ? true : false;
    byte = mem.u8[BASE + 0xA7AF];
    flags['area/ice_cavern']['location/ice_cavern.c_hp'] = (byte & BIT2) ? true : false;
    byte = mem.u8[BASE + 0xB476];
    flags['area/ice_cavern']['location/ice_cavern.s_block_puzzle_adult'] = (byte & BIT1) ? true : false;
    flags['area/ice_cavern']['location/ice_cavern.s_ice_blades_adult'] = (byte & BIT2) ? true : false;
    flags['area/ice_cavern']['location/ice_cavern.s_compass_room_adult'] = (byte & BIT3) ? true : false;
  }
  else if (prevDungeonTypes['area/ice_cavern'] && prevDungeonTypes['area/ice_cavern'].type == 'mq') {
    byte = mem.u8[BASE + 0xA7A3];
    flags['area/ice_cavern']['location/ice_cavern_mq.c_compass'] = (byte & BIT1) ? true : false;
    flags['area/ice_cavern']['location/ice_cavern_mq.c_map'] = (byte & BIT2) ? true : false;
    flags['area/ice_cavern']['location/ice_cavern_mq.c_boots'] = (byte & BIT3) ? true : false;
    byte = mem.u8[BASE + 0xA7AF];
    flags['area/ice_cavern']['location/ice_cavern_mq.c_hp'] = (byte & BIT2) ? true : false;
    byte = mem.u8[BASE + 0xB476];
    flags['area/ice_cavern']['location/ice_cavern_mq.s_scarecrow'] = (byte & BIT1) ? true : false;
    flags['area/ice_cavern']['location/ice_cavern_mq.s_hp_room'] = (byte & BIT2) ? true : false;
    flags['area/ice_cavern']['location/ice_cavern_mq.s_under_ice_block'] = (byte & BIT3) ? true : false;
  }
  if (prevDungeonTypes['area/temple_water'] && prevDungeonTypes['area/temple_water'].type == 'v') {
    byte = mem.u8[BASE + 0xA732];
    flags['area/temple_water']['location/temple_water.c_central_bow'] = (byte & BIT1) ? true : false;
    flags['area/temple_water']['location/temple_water.c_compass'] = (byte & BIT2) ? true : false;
    flags['area/temple_water']['location/temple_water.c_chest_dragon'] = (byte & BIT3) ? true : false;
    byte = mem.u8[BASE + 0xA733];
    flags['area/temple_water']['location/temple_water.c_cracked_wall'] = (byte & BIT1) ? true : false;
    flags['area/temple_water']['location/temple_water.c_torches'] = (byte & BIT2) ? true : false;
    flags['area/temple_water']['location/temple_water.c_map'] = (byte & BIT3) ? true : false;
    flags['area/temple_water']['location/temple_water.c_river'] = (byte & BIT4) ? true : false;
    flags['area/temple_water']['location/temple_water.c_boss_key'] = (byte & BIT6) ? true : false;
    flags['area/temple_water']['location/temple_water.c_center_pillar'] = (byte & BIT7) ? true : false;
    flags['area/temple_water']['location/temple_water.c_dark_link'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xB472];
    flags['area/temple_water']['location/temple_water.s_lowest_level_south_adult'] = (byte & BIT1) ? true : false;
    flags['area/temple_water']['location/temple_water.s_big_waterfall_adult'] = (byte & BIT2) ? true : false;
    flags['area/temple_water']['location/temple_water.s_center_pillar_adult'] = (byte & BIT3) ? true : false;
    flags['area/temple_water']['location/temple_water.s_near_boss_key_adult'] = (byte & BIT4) ? true : false;
    flags['area/temple_water']['location/temple_water.s_river_adult'] = (byte & BIT5) ? true : false;
  }
  else if (prevDungeonTypes['area/temple_water'] && prevDungeonTypes['area/temple_water'].type == 'mq') {
    byte = mem.u8[BASE + 0xA733];
    flags['area/temple_water']['location/temple_water_mq.c_longshot'] = (byte & BIT1) ? true : false;
    flags['area/temple_water']['location/temple_water_mq.c_compass'] = (byte & BIT2) ? true : false;
    flags['area/temple_water']['location/temple_water_mq.c_map'] = (byte & BIT3) ? true : false;
    flags['area/temple_water']['location/temple_water_mq.c_boss_key'] = (byte & BIT6) ? true : false;
    flags['area/temple_water']['location/temple_water_mq.c_central_pillar'] = (byte & BIT7) ? true : false;
    byte = mem.u8[BASE + 0xA73F];
    flags['area/temple_water']['location/temple_water_mq.c_freestanding_key'] = (byte & BIT2) ? true : false;
    byte = mem.u8[BASE + 0xB472];
    flags['area/temple_water']['location/temple_water_mq.s_lizalfos_hallway_adult'] = (byte & BIT1) ? true : false;
    flags['area/temple_water']['location/temple_water_mq.s_serpent_river_adult'] = (byte & BIT2) ? true : false;
    flags['area/temple_water']['location/temple_water_mq.s_before_upper_water_switch'] = (byte & BIT3) ? true : false;
    flags['area/temple_water']['location/temple_water_mq.s_north_basement_adult'] = (byte & BIT4) ? true : false;
    flags['area/temple_water']['location/temple_water_mq.s_south_basement_adult'] = (byte & BIT5) ? true : false;
  }
  if (prevDungeonTypes['area/temple_spirit'] && prevDungeonTypes['area/temple_spirit'].type == 'v') {
    byte = mem.u8[BASE + 0xA74D];
    flags['area/temple_spirit']['location/temple_spirit.c_topmost'] = (byte & BIT3) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit.c_hallway_right_invisible'] = (byte & BIT5) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit.c_hallway_left_invisible'] = (byte & BIT6) ? true : false;
    byte = mem.u8[BASE + 0xA74E];
    flags['area/temple_spirit']['location/temple_spirit.c_child_left'] = (byte & BIT1) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit.c_boss_key'] = (byte & BIT3) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit.c_child_climb_east'] = (byte & BIT5) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit.c_first_mirror_left'] = (byte & BIT6) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit.c_first_mirror_right'] = (byte & BIT7) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit.c_main_room_NE'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xA74F];
    flags['area/temple_spirit']['location/temple_spirit.c_child_right'] = (byte & BIT1) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit.c_sun_block'] = (byte & BIT2) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit.c_statue_hand'] = (byte & BIT3) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit.c_map'] = (byte & BIT4) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit.c_compass'] = (byte & BIT5) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit.c_near_four_armos'] = (byte & BIT6) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit.c_child_climb_north'] = (byte & BIT7) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit.c_early_adult_right'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xB471];
    flags['area/temple_spirit']['location/temple_spirit.s_childsegment_before_iron_knight'] = (byte & BIT1) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit.s_rolling_boulders_time_block_adult'] = (byte & BIT2) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit.s_coloss_room_adult'] = (byte & BIT3) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit.s_childsegment_sun_room'] = (byte & BIT4) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit.s_childsegment_left'] = (byte & BIT5) ? true : false;
  }
  else if (prevDungeonTypes['area/temple_spirit'] && prevDungeonTypes['area/temple_spirit'].type == 'mq') {
    byte = mem.u8[BASE + 0xA74C];
    flags['area/temple_spirit']['location/temple_spirit_mq.c_dinolfos_ice'] = (byte & BIT1) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.c_beamos_room'] = (byte & BIT2) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.c_entrance_front_left'] = (byte & BIT3) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.c_entrance_front_right'] = (byte & BIT4) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.c_silver_block_hallway'] = (byte & BIT5) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.c_child_center'] = (byte & BIT6) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.c_entrance_back_left'] = (byte & BIT7) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.c_entrance_back_right'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xA74D];
    flags['area/temple_spirit']['location/temple_spirit_mq.c_mirror_puzzle_invisible'] = (byte & BIT3) ? true : false;
    byte = mem.u8[BASE + 0xA74E];
    flags['area/temple_spirit']['location/temple_spirit_mq.c_child_left'] = (byte & BIT1) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.c_child_climb_south'] = (byte & BIT5) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.c_lower_ne_main_room'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xA74F];
    flags['area/temple_spirit']['location/temple_spirit_mq.c_map'] = (byte & BIT1) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.c_sun_block_room'] = (byte & BIT2) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.c_upper_ne_main_room'] = (byte & BIT3) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.c_compass_chest'] = (byte & BIT4) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.c_lower_adult_left'] = (byte & BIT5) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.c_boss_key'] = (byte & BIT6) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.c_child_climb_north'] = (byte & BIT7) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.c_lower_adult_right'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xB471];
    flags['area/temple_spirit']['location/temple_spirit_mq.s_sun_block_room'] = (byte & BIT1) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.s_lower_adult_left'] = (byte & BIT2) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.s_iron_knuckles_west'] = (byte & BIT3) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.s_lower_adult_right'] = (byte & BIT4) ? true : false;
    flags['area/temple_spirit']['location/temple_spirit_mq.s_iron_knuckles_north'] = (byte & BIT5) ? true : false;
  }
  if (prevDungeonTypes['area/well'] && prevDungeonTypes['area/well'].type == 'v') {
    byte = mem.u8[BASE + 0xA785];
    flags['area/well']['location/well.c_underwater_front'] = (byte & BIT1) ? true : false;
    flags['area/well']['location/well.c_invisible'] = (byte & BIT5) ? true : false;
    byte = mem.u8[BASE + 0xA786];
    flags['area/well']['location/well.c_front_left_hidden_wall'] = (byte & BIT1) ? true : false;
    flags['area/well']['location/well.c_underwater_left'] = (byte & BIT2) ? true : false;
    flags['area/well']['location/well.c_locked_pits'] = (byte & BIT3) ? true : false;
    flags['area/well']['location/well.c_behind_right_grate'] = (byte & BIT5) ? true : false;
    flags['area/well']['location/well.c_center_small'] = (byte & BIT7) ? true : false;
    byte = mem.u8[BASE + 0xA787];
    flags['area/well']['location/well.c__center_large'] = (byte & BIT2) ? true : false;
    flags['area/well']['location/well.c_front_center_bombable'] = (byte & BIT3) ? true : false;
    flags['area/well']['location/well.c_defeat_boss'] = (byte & BIT4) ? true : false;
    flags['area/well']['location/well.c_back_left_bombable'] = (byte & BIT5) ? true : false;
    flags['area/well']['location/well.c_right_bottom_hidden_wall'] = (byte & BIT6) ? true : false;
    flags['area/well']['location/well.c_basement_ches'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xA793];
    flags['area/well']['location/well.c_coffin_key'] = (byte & BIT2) ? true : false;
    byte = mem.u8[BASE + 0xB477];
    flags['area/well']['location/well.s_locked_pits_child'] = (byte & BIT1) ? true : false;
    flags['area/well']['location/well.s_east_inner_child'] = (byte & BIT2) ? true : false;
    flags['area/well']['location/well.s_west_inner_child'] = (byte & BIT3) ? true : false;
  }
  else if (prevDungeonTypes['area/well'] && prevDungeonTypes['area/well'].type == 'mq') {
    byte = mem.u8[BASE + 0xA787];
    flags['area/well']['location/well_mq.c_lens_chest'] = (byte & BIT2) ? true : false;
    flags['area/well']['location/well_mq.c_compass_chest'] = (byte & BIT3) ? true : false;
    flags['area/well']['location/well_mq.c_map_chest'] = (byte & BIT4) ? true : false;
    byte = mem.u8[BASE + 0xA793];
    flags['area/well']['location/well_mq.c_east_inner_freestanding_key'] = (byte & BIT2) ? true : false;
    flags['area/well']['location/well_mq.c_deadhand_freestanding_key'] = (byte & BIT3) ? true : false;
    byte = mem.u8[BASE + 0xB477];
    flags['area/well']['location/well_mq.s_basement'] = (byte & BIT1) ? true : false;
    flags['area/well']['location/well_mq.s_west_inner'] = (byte & BIT2) ? true : false;
    flags['area/well']['location/well_mq.s_coffin_room'] = (byte & BIT3) ? true : false;
  }
  if (prevDungeonTypes['area/temple_shadow'] && prevDungeonTypes['area/temple_shadow'].type == 'v') {
    byte = mem.u8[BASE + 0xA769];
    flags['area/temple_shadow']['location/temple_shadow.c_after_wind_hidden'] = (byte & BIT5) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow.c_wind_hint'] = (byte & BIT6) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow.c_invisible_blades_invisible'] = (byte & BIT7) ? true : false;
    byte = mem.u8[BASE + 0xA76A];
    flags['area/temple_shadow']['location/temple_shadow.c_after_wind_enemy'] = (byte & BIT1) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow.c_invisible_spikes'] = (byte & BIT2) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow.c_spike_walls'] = (byte & BIT3) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow.c_boss_key'] = (byte & BIT4) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow.c_invisible_blades_visible'] = (byte & BIT5) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow.c_hidden_floormaster'] = (byte & BIT6) ? true : false;
    byte = mem.u8[BASE + 0xA76B];
    flags['area/temple_shadow']['location/temple_shadow.c_map'] = (byte & BIT2) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow.c_early_silver'] = (byte & BIT3) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow.c_compass'] = (byte & BIT4) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow.c_falling_spikes_switch'] = (byte & BIT5) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow.c_falling_spikes_lower'] = (byte & BIT6) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow.c_falling_spikes_upper'] = (byte & BIT7) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow.c_boots'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xA777];
    flags['area/temple_shadow']['location/temple_shadow.c_giant_pot'] = (byte & BIT2) ? true : false;
    byte = mem.u8[BASE + 0xB470];
    flags['area/temple_shadow']['location/temple_shadow.s_behind_giant_pot_adult'] = (byte & BIT1) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow.s_falling_spikes_adult'] = (byte & BIT2) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow.s_behind_giant_pots_adult'] = (byte & BIT3) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow.s_invisible_blade_adult'] = (byte & BIT4) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow.s_boat_adult'] = (byte & BIT5) ? true : false;
  }
  else if (prevDungeonTypes['area/temple_shadow'] && prevDungeonTypes['area/temple_shadow'].type == 'mq') {
    byte = mem.u8[BASE + 0xA769];
    flags['area/temple_shadow']['location/temple_shadow_mq.c_stalfos_room'] = (byte & BIT1) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.c_after_wind_hidden'] = (byte & BIT5) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.c_wind_hint'] = (byte & BIT6) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.c_invisible_blades_invisible'] = (byte & BIT7) ? true : false;
    byte = mem.u8[BASE + 0xA76A];
    flags['area/temple_shadow']['location/temple_shadow_mq.c_after_wind_enemy'] = (byte & BIT1) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.c_invisible_spikes'] = (byte & BIT2) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.c_spike_walls_left'] = (byte & BIT3) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.c_boss_key'] = (byte & BIT4) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.c_invisible_blades_visible'] = (byte & BIT5) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.c_bomb_flower_chest'] = (byte & BIT6) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.c_near_ship_invisible'] = (byte & BIT7) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.c_beamos_silver'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xA76B];
    flags['area/temple_shadow']['location/temple_shadow_mq.c_compass'] = (byte & BIT2) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.c_map'] = (byte & BIT3) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.c_early_gibdos'] = (byte & BIT4) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.c_falling_spikes_switch'] = (byte & BIT5) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.c_falling_spikes_lower'] = (byte & BIT6) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.c_falling_spikes_upper'] = (byte & BIT7) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.c_boots'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xA777];
    flags['area/temple_shadow']['location/temple_shadow_mq.c_freestanding_key'] = (byte & BIT7) ? true : false;
    byte = mem.u8[BASE + 0xB470];
    flags['area/temple_shadow']['location/temple_shadow_mq.s_wind_hint_adult'] = (byte & BIT1) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.s_crusher_room_adult'] = (byte & BIT2) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.s_near_boss_adult'] = (byte & BIT3) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.s_after_wind_adult'] = (byte & BIT4) ? true : false;
    flags['area/temple_shadow']['location/temple_shadow_mq.s_after_ship_adult'] = (byte & BIT5) ? true : false;
  }
  if (prevDungeonTypes['area/training_grounds'] && prevDungeonTypes['area/training_grounds'].type == 'v') {
    byte = mem.u8[BASE + 0xA7D9];
    flags['area/training_grounds']['location/training_grounds.c_hammer_room_switch'] = (byte & BIT1) ? true : false;
    flags['area/training_grounds']['location/training_grounds.c_heavy_block_before'] = (byte & BIT2) ? true : false;
    flags['area/training_grounds']['location/training_grounds.c_hammer_room_clear'] = (byte & BIT3) ? true : false;
    flags['area/training_grounds']['location/training_grounds.c_lobby_left'] = (byte & BIT4) ? true : false;
    flags['area/training_grounds']['location/training_grounds.c_heavy_block_3'] = (byte & BIT5) ? true : false;
    byte = mem.u8[BASE + 0xA7DA];
    flags['area/training_grounds']['location/training_grounds.c_maze_right'] = (byte & BIT1) ? true : false;
    flags['area/training_grounds']['location/training_grounds.c_maze_3'] = (byte & BIT2) ? true : false;
    flags['area/training_grounds']['location/training_grounds.c_maze_2'] = (byte & BIT3) ? true : false;
    flags['area/training_grounds']['location/training_grounds.c_hidden_ceiling'] = (byte & BIT4) ? true : false;
    flags['area/training_grounds']['location/training_grounds.c_maze_final'] = (byte & BIT5) ? true : false;
    flags['area/training_grounds']['location/training_grounds.c_underwater_silver'] = (byte & BIT6) ? true : false;
    flags['area/training_grounds']['location/training_grounds.c_heavy_block_2'] = (byte & BIT7) ? true : false;
    flags['area/training_grounds']['location/training_grounds.c_heavy_block_1'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xA7DB];
    flags['area/training_grounds']['location/training_grounds.c_stalfos'] = (byte & BIT1) ? true : false;
    flags['area/training_grounds']['location/training_grounds.c_beamos'] = (byte & BIT2) ? true : false;
    flags['area/training_grounds']['location/training_grounds.c_heavy_block_4'] = (byte & BIT3) ? true : false;
    flags['area/training_grounds']['location/training_grounds.c_eye_statue'] = (byte & BIT4) ? true : false;
    flags['area/training_grounds']['location/training_grounds.c_scarecrow'] = (byte & BIT5) ? true : false;
    flags['area/training_grounds']['location/training_grounds.c_maze_right_central'] = (byte & BIT6) ? true : false;
    flags['area/training_grounds']['location/training_grounds.c_maze_1'] = (byte & BIT7) ? true : false;
    flags['area/training_grounds']['location/training_grounds.c_lobby_right'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xA7E7];
    flags['area/training_grounds']['location/training_grounds.c_maze_right_key'] = (byte & BIT2) ? true : false;
  }
  else if (prevDungeonTypes['area/training_grounds'] && prevDungeonTypes['area/training_grounds'].type == 'mq') {
    byte = mem.u8[BASE + 0xA7D9];
    flags['area/training_grounds']['location/training_grounds_mq.c_before_heavy_block'] = (byte & BIT2) ? true : false;
    flags['area/training_grounds']['location/training_grounds_mq.c_second_iron_knuckle'] = (byte & BIT3) ? true : false;
    flags['area/training_grounds']['location/training_grounds_mq.c_lobby_left'] = (byte & BIT4) ? true : false;
    byte = mem.u8[BASE + 0xA7DA];
    flags['area/training_grounds']['location/training_grounds_mq.c_maze_right_side'] = (byte & BIT1) ? true : false;
    flags['area/training_grounds']['location/training_grounds_mq.c_maze_3'] = (byte & BIT2) ? true : false;
    flags['area/training_grounds']['location/training_grounds_mq.c_maze_2'] = (byte & BIT3) ? true : false;
    flags['area/training_grounds']['location/training_grounds_mq.c_hidden_ceiling'] = (byte & BIT4) ? true : false;
    flags['area/training_grounds']['location/training_grounds_mq.c_underwater'] = (byte & BIT6) ? true : false;
    flags['area/training_grounds']['location/training_grounds_mq.c_flame_circle'] = (byte & BIT7) ? true : false;
    byte = mem.u8[BASE + 0xA7DB];
    flags['area/training_grounds']['location/training_grounds_mq.c_first_iron_knuckle'] = (byte & BIT1) ? true : false;
    flags['area/training_grounds']['location/training_grounds_mq.c_dinolfos'] = (byte & BIT2) ? true : false;
    flags['area/training_grounds']['location/training_grounds_mq.c_heavy_block'] = (byte & BIT3) ? true : false;
    flags['area/training_grounds']['location/training_grounds_mq.c_eye_statue'] = (byte & BIT4) ? true : false;
    flags['area/training_grounds']['location/training_grounds_mq.c_ice_arrows'] = (byte & BIT5) ? true : false;
    flags['area/training_grounds']['location/training_grounds_mq.c_maze_right_central'] = (byte & BIT6) ? true : false;
    flags['area/training_grounds']['location/training_grounds_mq.c_maze_1'] = (byte & BIT7) ? true : false;
    flags['area/training_grounds']['location/training_grounds_mq.c_lobby_right'] = (byte & BIT8) ? true : false;
  }
  if (prevDungeonTypes['area/castle_ganon'] && prevDungeonTypes['area/castle_ganon'].type == 'v') {
    byte = mem.u8[BASE + 0xA7BE];
    flags['area/castle_ganon']['location/castle_ganon.c_boss_key'] = (byte & BIT4) ? true : false;
    byte = mem.u8[BASE + 0xA811];
    flags['area/castle_ganon']['location/castle_ganon.c_light_trail_invisible_enemies'] = (byte & BIT1) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon.c_light_trial_lullaby'] = (byte & BIT2) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon.c_spirit_trial_first'] = (byte & BIT3) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon.c_spirit_trial_second'] = (byte & BIT5) ? true : false;
    byte = mem.u8[BASE + 0xA812];
    flags['area/castle_ganon']['location/castle_ganon.c_shadow_trial_first'] = (byte & BIT1) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon.c_forest_trial'] = (byte & BIT2) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon.c_light_trial_second_right'] = (byte & BIT3) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon.c_light_trial_second_left'] = (byte & BIT4) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon.c_light_trial_first_left'] = (byte & BIT5) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon.c_light_trial_third_left'] = (byte & BIT6) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon.c_light_trial_first_right'] = (byte & BIT7) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon.c_light_trial_third_right'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xA813];
    flags['area/castle_ganon']['location/castle_ganon.c_shadow_trial_second'] = (byte & BIT6) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon.c_water_trial_right'] = (byte & BIT7) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon.c_water_trial_left'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xA822];
    flags['area/castle_ganon']['location/castle_ganon.c_under_bridge_salesman_4'] = (byte & BIT1) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon.c_under_bridge_salesman_1'] = (byte & BIT2) ? true : false;
    byte = mem.u8[BASE + 0xA823];
    flags['area/castle_ganon']['location/castle_ganon.c_under_bridge_salesman_3'] = (byte & BIT5) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon.c_under_bridge_salesman_2'] = (byte & BIT7) ? true : false;
  }
  else if (prevDungeonTypes['area/castle_ganon'] && prevDungeonTypes['area/castle_ganon'].type == 'mq') {
    byte = mem.u8[BASE + 0xA7BE];
    flags['area/castle_ganon']['location/castle_ganon_mq.c_boss_key'] = (byte & BIT4) ? true : false;
    byte = mem.u8[BASE + 0xA811];
    flags['area/castle_ganon']['location/castle_ganon_mq.c_spirit_trial_second'] = (byte & BIT5) ? true : false;
    byte = mem.u8[BASE + 0xA812];
    flags['area/castle_ganon']['location/castle_ganon_mq.c_spirit_sun_back_left'] = (byte & BIT1) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon_mq.c_spirit_sun_back_right'] = (byte & BIT2) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon_mq.c_spirit_trial_first'] = (byte & BIT3) ? true : false;
    byte = mem.u8[BASE + 0xA813];
    flags['area/castle_ganon']['location/castle_ganon_mq.c_shadow_trial_first'] = (byte & BIT1) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon_mq.c_water_trial'] = (byte & BIT2) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon_mq.c_forest_trial_first'] = (byte & BIT3) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon_mq.c_forest_trial_second'] = (byte & BIT4) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon_mq.c_light_trial_lullaby'] = (byte & BIT5) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon_mq.c_shadow_trial_second'] = (byte & BIT6) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon_mq.c_spirit_golden'] = (byte & BIT7) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon_mq.c_spirit_sun_front_left'] = (byte & BIT8) ? true : false;
    byte = mem.u8[BASE + 0xA81F];
    flags['area/castle_ganon']['location/castle_ganon_mq.c_forest_trial_key'] = (byte & BIT2) ? true : false;
    byte = mem.u8[BASE + 0xA822];
    flags['area/castle_ganon']['location/castle_ganon_mq.c_under_bridge_salesman_4'] = (byte & BIT1) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon_mq.c_under_bridge_salesman_1'] = (byte & BIT2) ? true : false;
    byte = mem.u8[BASE + 0xA823];
    flags['area/castle_ganon']['location/castle_ganon_mq.c_under_bridge_salesman_5'] = (byte & BIT2) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon_mq.c_under_bridge_salesman_3'] = (byte & BIT5) ? true : false;
    flags['area/castle_ganon']['location/castle_ganon_mq.c_under_bridge_salesman_2'] = (byte & BIT7) ? true : false;
  }

  for (var location in flags) {
    if (!prevFlags[location]) prevFlags[location] = {};
    for (var flag in flags[location]) {
      if (prevFlags[location][flag] != flags[location][flag]) {
        var value = flags[location][flag];
        prevFlags[location][flag] = value;
        for (var i = 0; i < clients.length; i++) {
          clients[i].send('1 '+location+' '+flag+' '+value);
        }
        changed = true;
      }
    }
  }
}

var clients = [];

function getCurrentMode() {
  //0 N64 Logo
  //1 Title Screen
  //2 File Select
  //3 Normal Gameplay
  //4 Cutscene
  //5 Paused
  //6 Dying
  //7 Dying Menu Start
  //8 Dead

  var mode = -1;
  if (pj64.romInfo == null) return mode;
  var logo_state = mem.u32[0x8011F200];
  if (logo_state == 0x802C5880 || logo_state == 0x00000000) {
    mode = 0;
  }
  else {
    var state_main = mem.u8[0x8011B92F];
    if (state_main == 1) mode = 1;
    else if (state_main == 2) mode = 2;
    else {
      var menu_state = mem.u8[0x801D8DD5];
      if (menu_state == 0) {
        if (mem.u32[0x801DB09C] & 0x000000F0 || mem.u16[0x8011a600] <= 0) mode = 6;
        else {
          if (mem.u8[0x8011B933] == 4) mode = 4;
          else mode = 3;
        }
      }
      else if ((0 < menu_state && menu_state < 9) || menu_state == 13 || menu_state == 18 || menu_state == 19) mode = 5;
      else if (menu_state == 9 || menu_state == 0xB) mode = 7;
      else mode = 8;
    }
  }
  return mode;
}

function checkItems() {
  var items = {}
  var byte;
  var byte2;
  var tmp;

  items['item.magic_power'] = mem.u8[SAVE + 0x32];

  byte = mem.u32[SAVE + 0xA0];
  items['item.bow'] = byte & (BIT1 | BIT2);
  items['item.bombs'] = (byte & (BIT4 | BIT5)) >> 3;
  items['item.glove'] = (byte & (BIT7 | BIT8)) >> 6;
  items['item.scale'] = (byte & (BIT10 | BIT11)) >> 9;
  items['item.wallet'] = (byte & (BIT13 | BIT14)) >> 12;
  items['item.slingshot'] = (byte & (BIT15 | BIT16)) >> 14;
  items['item.stick'] = (byte & (BIT18 | BIT19 | BIT20)) >> 17;
  if (items['item.stick'] == 5) items['item.stick'] = 2;
  items['item.nut'] = (byte & (BIT21 | BIT22)) >> 20;

  items['item.arrow_fire'] = 0;
  if (mem.u8[SAVE + 0x74 + 4] == 0x4) items['item.arrow_fire'] = 1;

  items['item.magic_din'] = 0;
  if (mem.u8[SAVE + 0x74 + 5] == 0x5) items['item.magic_din'] = 1;

  items['item.ocarina'] = 0;
  tmp = mem.u8[SAVE + 0x74 + 7];
  if (tmp == 0x7) items['item.ocarina'] = 1;
  else if (tmp == 0x8) items['item.ocarina'] = 2;

  items['item.bombchu'] = 0;
  if (mem.u8[SAVE + 0x74 + 8] == 0x9) items['item.bombchu'] = 1;

  items['item.hookshot'] = 0;
  tmp = mem.u8[SAVE + 0x74 + 9];
  if (tmp == 0xA) items['item.hookshot'] = 1;
  else if (tmp == 0xB) items['item.hookshot'] = 2;

  items['item.arrow_ice'] = 0;
  if (mem.u8[SAVE + 0x74 + 10] == 0xC) items['item.arrow_ice'] = 1;

  items['item.magic_farore'] = 0;
  if (mem.u8[SAVE + 0x74 + 11] == 0xD) items['item.magic_farore'] = 1;

  items['item.boomerang'] = 0;
  if (mem.u8[SAVE + 0x74 + 12] == 0xE) items['item.boomerang'] = 1;

  items['item.lens'] = 0;
  if (mem.u8[SAVE + 0x74 + 13] == 0xF) items['item.lens'] = 1;

  items['item.bean'] = 0;
  if (mem.u8[SAVE + 0x74 + 14] == 0x10) {
    tmp = mem.u8[SAVE + 0x8C + 14];
    if (mem.u8[BASE + 0xAFBF] & BIT4) tmp++;
    if (mem.u8[BASE + 0xAFDB] & BIT4) tmp++;
    if (mem.u8[BASE + 0xAFF6] & BIT2) tmp++;
    if (mem.u8[BASE + 0xB02F] & BIT2) tmp++;
    if (mem.u8[BASE + 0xB083] & BIT4) tmp++;
    if (mem.u8[BASE + 0xB09D] & BIT3) tmp++;
    if (mem.u8[BASE + 0xB09F] & BIT5) tmp++;
    if (mem.u8[BASE + 0xB0B8] & BIT1) tmp++;
    if (mem.u8[BASE + 0xB12B] & BIT7) tmp++;
    if (mem.u8[BASE + 0xB147] & BIT4) tmp++;
    items['item.bean'] = tmp;
  }

  items['item.hammer'] = 0;
  if (mem.u8[SAVE + 0x74 + 15] == 0x11) items['item.hammer'] = 1;

  items['item.arrow_light'] = 0;
  if (mem.u8[SAVE + 0x74 + 16] == 0x12) items['item.arrow_light'] = 1;

  items['item.magic_nayru'] = 0;
  if (mem.u8[SAVE + 0x74 + 17] == 0x13) items['item.magic_nayru'] = 1;

  items['item.bottle'] = 0;
  tmp = [
    mem.u8[SAVE + 0x74 + 18],
    mem.u8[SAVE + 0x74 + 19],
    mem.u8[SAVE + 0x74 + 20],
    mem.u8[SAVE + 0x74 + 21],
  ];
  if (tmp[0] != 0xFF) items['item.bottle']++;
  if (tmp[1] != 0xFF) items['item.bottle']++;
  if (tmp[2] != 0xFF) items['item.bottle']++;
  if (tmp[3] != 0xFF) items['item.bottle']++;

  items['item.zora_letter'] = 0;
  if (tmp[0] == 0x1B) {items['item.zora_letter'] = 1;items['item.bottle']--;}
  else if (tmp[1] == 0x1B) {items['item.zora_letter'] = 1;items['item.bottle']--;}
  else if (tmp[2] == 0x1B) {items['item.zora_letter'] = 1;items['item.bottle']--;}
  else if (tmp[3] == 0x1B) {items['item.zora_letter'] = 1;items['item.bottle']--;}
  if (mem.u8[BASE + 0xB4AB] & BIT4) items['item.zora_letter'] = 1;

  items['item.poe_big'] = mem.u32[SAVE + 0xEBC] / 10;
  if (tmp[0] == 0x1E) {items['item.poe_big']++;items['item.bottle']--;}
  if (tmp[1] == 0x1E) {items['item.poe_big']++;items['item.bottle']--;}
  if (tmp[2] == 0x1E) {items['item.poe_big']++;items['item.bottle']--;}
  if (tmp[3] == 0x1E) {items['item.poe_big']++;items['item.bottle']--;}

  items['item.cojiro'] = 0;
  tmp = mem.u8[SAVE + 0x74 + 22];
  if (tmp == 0x2D) items['item.cojiro'] = 1;
  else if (tmp == 0x2E) items['item.cojiro'] = 2;
  else if (tmp == 0x2F) items['item.cojiro'] = 3;
  else if (tmp == 0x30) items['item.cojiro'] = 4;
  else if (tmp == 0x31) items['item.cojiro'] = 5;
  else if (tmp == 0x32) items['item.cojiro'] = 6;
  else if (tmp == 0x33) items['item.cojiro'] = 7;
  else if (tmp == 0x34) items['item.cojiro'] = 8;
  else if (tmp == 0x35) items['item.cojiro'] = 9;
  else if (tmp == 0x36) items['item.cojiro'] = 10;
  else if (tmp == 0x37) items['item.cojiro'] = 11;

  items['item.egg'] = 0;
  tmp = mem.u8[SAVE + 0x74 + 23];
  if (tmp == 0x21) items['item.egg'] = 1;
  else if (tmp == 0x22) items['item.egg'] = 2;
  else if (tmp == 0x23) items['item.egg'] = 3;
  if (prevFlags['area/castle'] && prevFlags['area/castle']['location/castle_town.c_zelda']) {
    byte = mem.u8[BASE + 0xB4D7];
    byte2 = mem.u8[BASE + 0xB4C6];
    if (byte2 & BIT4) items['item.egg'] = 8;
    else if (byte2 & BIT3) items['item.egg'] = 7;
    else if (byte2 & BIT2) items['item.egg'] = 6;
    else if (byte & BIT8) items['item.egg'] = 5;
    else if (byte & BIT7) items['item.egg'] = 4;
  }

  var byte = mem.u16[SAVE + 0x9C];
  items['item.sword_kokiri'] = (byte & BIT1) ? 1 : 0;
  items['item.sword_master'] = (byte & BIT2) ? 1 : 0;
  items['item.sword_biggoron'] = mem.u8[0x8011A60E] ? ((byte & BIT3) ? 1 : 0) : 0;
  items['item.shield_kokiri'] = (byte & BIT5) ? 1 : 0;
  items['item.shield_hylia'] = (byte & BIT6) ? 1 : 0;
  items['item.shield_mirror'] = (byte & BIT7) ? 1 : 0;
  items['item.tunic_fire'] = (byte & BIT10) ? 1 : 0;
  items['item.tunic_water'] = (byte & BIT11) ? 1 : 0;
  items['item.boots_iron'] = (byte & BIT14) ? 1 : 0;
  items['item.boots_hover'] = (byte & BIT15) ? 1 : 0;

  items['item.skulltula'] = mem.u8[SAVE + 0xD1];
  items['item.heart_piece'] = mem.u8[SAVE + 0xA4] / 0x10;
  items['item.heart_container'] = mem.u16[SAVE + 0x2E] / 0x10 - 3;
  if (items['item.heart_container'] > 8) {
    items['item.heart_piece'] += (items['item.heart_container']-8)*4;
    items['item.heart_container'] = 8;
  }
  items['item.heart_double'] = 0;
  if (mem.u8[SAVE + 0xCF] > 0) items['item.heart_double'] = 1;

  byte = mem.u32[SAVE + 0xA4];
  items['item.medallion_forest'] = (byte & BIT1) ? 1 : 0;
  items['item.medallion_fire'] = (byte & BIT2) ? 1 : 0;
  items['item.medallion_water'] = (byte & BIT3) ? 1 : 0;
  items['item.medallion_spirit'] = (byte & BIT4) ? 1 : 0;
  items['item.medallion_shadow'] = (byte & BIT5) ? 1 : 0;
  items['item.medallion_light'] = (byte & BIT6) ? 1 : 0;
  items['item.warp_forest'] = (byte & BIT7) ? 1 : 0;
  items['item.warp_fire'] = (byte & BIT8) ? 1 : 0;
  items['item.warp_water'] = (byte & BIT9) ? 1 : 0;
  items['item.warp_spirit'] = (byte & BIT10) ? 1 : 0;
  items['item.warp_shadow'] = (byte & BIT11) ? 1 : 0;
  items['item.warp_light'] = (byte & BIT12) ? 1 : 0;
  items['item.song_zelda'] = (byte & BIT13) ? 1 : 0;
  items['item.song_epona'] = (byte & BIT14) ? 1 : 0;
  items['item.song_saria'] = (byte & BIT15) ? 1 : 0;
  items['item.song_sun'] = (byte & BIT16) ? 1 : 0;
  items['item.song_time'] = (byte & BIT17) ? 1 : 0;
  items['item.song_storm'] = (byte & BIT18) ? 1 : 0;
  items['item.song_scarecrow'] = (mem.u8[BASE + 0xB4B6] & BIT5) ? 1 : 0;
  items['item.stone_forest'] = (byte & BIT19) ? 1 : 0;
  items['item.stone_fire'] = (byte & BIT20) ? 1 : 0;
  items['item.stone_water'] = (byte & BIT21) ? 1 : 0;
  items['item.stone_of_agony'] = (byte & BIT22) ? 1 : 0;
  items['item.membership'] = (byte & BIT23) ? 1 : 0;

  for (var item in items) {
    if (prevItems[item] != items[item]) {
      var value = items[item];
      prevItems[item] = value;
      for (var i = 0; i < clients.length; i++) {
        clients[i].send('0 '+item+' '+value);
      }
      changed = true;
    }
  }
}

function findDungeonTypeAddr() {
  if (findDungeonTypeAddrCache != null) return findDungeonTypeAddrCache;
  if (pj64.romInfo != null) {
    var rando = mem.u32[0x801C8464];
    if (rando != 0) {
      var coop = mem.u32[rando];
      if (mem.u32[coop] == 2) {
        var begin = mem.u32[rando + 0x8] + 0x1200;
        var end = begin + 0x1000;
        for (var i = begin; i < end; i += 0x4) {
          if (mem.u32[i] == 0x805E4D30) {
            return i + 8;
          }
        }
      }
    }
  }
  return 0;
}

function checkDungeons() {
  var state = {}
  var types = {};
  var byte;
  var tmp;
  var typeAddr = findDungeonTypeAddr();

  types['area/deku'] = mem.u8[typeAddr + 0x0] ? 'mq' : 'v';
  byte = mem.u8[BASE + 0xA678];
  state['item.compass_deku'] = (byte & BIT2) ? 1 : 0;
  state['item.dungeon_map_deku'] = (byte & BIT3) ? 1 : 0;

  types['area/dodongo'] = mem.u8[typeAddr + 0x1] ? 'mq' : 'v';
  byte = mem.u8[BASE + 0xA679];
  state['item.compass_dodongo'] = (byte & BIT2) ? 1 : 0;
  state['item.dungeon_map_dodongo'] = (byte & BIT3) ? 1 : 0;

  types['area/jabujabu'] = mem.u8[typeAddr + 0x2] ? 'mq' : 'v';
  byte = mem.u8[BASE + 0xA67A];
  state['item.compass_jabujabu'] = (byte & BIT2) ? 1 : 0;
  state['item.dungeon_map_jabujabu'] = (byte & BIT3) ? 1 : 0;

  types['area/temple_forest'] = mem.u8[typeAddr + 0x3] ? 'mq' : 'v';
  tmp = mem.u8[BASE + 0xA68F];
  if (tmp == 0xFF) tmp = 0;
  byte = mem.u8[BASE + 0xA6FF];
  if (types['area/temple_forest'] == 'v') {
    if (byte & BIT1) tmp++;
    if (byte & BIT2) tmp++;
    if (byte & BIT3) tmp++;
    if (byte & BIT4) tmp++;
    if (byte & BIT5) tmp++;
  }
  else if (types['area/temple_forest'] == 'mq') {
    if (byte & BIT1) tmp++;
    if (byte & BIT2) tmp++;
    if (byte & BIT3) tmp++;
    if (byte & BIT4) tmp++;
    if (byte & BIT5) tmp++;
    if (byte & BIT7) tmp++;
  }
  state['item.key_small_forest'] = tmp;
  byte = mem.u8[BASE + 0xA67B];
  state['item.key_boss_forest'] = (byte & BIT1) ? 1 : 0;
  state['item.compass_temple_forest'] = (byte & BIT2) ? 1 : 0;
  state['item.dungeon_map_temple_forest'] = (byte & BIT3) ? 1 : 0;

  types['area/temple_fire'] = mem.u8[typeAddr + 0x4] ? 'mq' : 'v';
  tmp = mem.u8[BASE + 0xA690];
  if (tmp == 0xFF) tmp = 0;
  if (types['area/temple_fire'] == 'v') {
    byte = mem.u8[BASE + 0xA718];
    if (byte & BIT1) tmp++;
    if (byte & BIT2) tmp++;
    if (byte & BIT3) tmp++;
    if (byte & BIT4) tmp++;
    if (byte & BIT6) tmp++;
    if (byte & BIT7) tmp++;
    if (byte & BIT8) tmp++;
  }
  else if (types['area/temple_fire'] == 'mq') {
    byte = mem.u8[BASE + 0xA718];
    if (byte & BIT1) tmp++;
    if (byte & BIT3) tmp++;
    if (byte & BIT4) tmp++;
    if (byte & BIT7) tmp++;
    byte = mem.u8[BASE + 0xA719];
    if (byte & BIT8) tmp++;
  }
  state['item.key_small_fire'] = tmp;
  byte = mem.u8[BASE + 0xA67C];
  state['item.key_boss_fire'] = (byte & BIT1) ? 1 : 0;
  state['item.compass_temple_fire'] = (byte & BIT2) ? 1 : 0;
  state['item.dungeon_map_temple_fire'] = (byte & BIT3) ? 1 : 0;

  types['area/ice_cavern'] = mem.u8[typeAddr + 0x9] ? 'mq' : 'v';
  byte = mem.u8[BASE + 0xA681];
  state['item.compass_ice'] = (byte & BIT2) ? 1 : 0;
  state['item.dungeon_map_ice'] = (byte & BIT3) ? 1 : 0;

  types['area/temple_water'] = mem.u8[typeAddr + 0x5] ? 'mq' : 'v';
  tmp = mem.u8[BASE + 0xA691];
  if (tmp == 0xFF) tmp = 0;
  if (types['area/temple_water'] == 'v') {
    byte = mem.u8[BASE + 0xA736];
    if (byte & BIT2) tmp++;
    byte = mem.u8[BASE + 0xA737];
    if (byte & BIT2) tmp++;
    if (byte & BIT3) tmp++;
    if (byte & BIT6) tmp++;
    if (byte & BIT7) tmp++;
  }
  else if (types['area/temple_water'] == 'mq') {
    byte = mem.u8[BASE + 0xA735];
    if (byte & BIT6) tmp++;
    byte = mem.u8[BASE + 0xA737];
    if (byte & BIT3) tmp++;
  }
  state['item.key_small_water'] = tmp;
  byte = mem.u8[BASE + 0xA67D];
  state['item.key_boss_water'] = (byte & BIT1) ? 1 : 0;
  state['item.compass_temple_water'] = (byte & BIT2) ? 1 : 0;
  state['item.dungeon_map_temple_water'] = (byte & BIT3) ? 1 : 0;

  types['area/temple_spirit'] = mem.u8[typeAddr + 0x6] ? 'mq' : 'v';
  tmp = mem.u8[BASE + 0xA692];
  if (tmp == 0xFF) tmp = 0;
  if (types['area/temple_spirit'] == 'v') {
    byte = mem.u8[BASE + 0xA750];
    if (byte & BIT4) tmp++;
    if (byte & BIT5) tmp++;
    if (byte & BIT7) tmp++;
    byte = mem.u8[BASE + 0xA751];
    if (byte & BIT6) tmp++;
    byte = mem.u8[BASE + 0xA752];
    if (byte & BIT6) tmp++;
  }
  else if (types['area/temple_spirit'] == 'mq') {
    byte = mem.u8[BASE + 0xA750];
    if (byte & BIT4) tmp++;
    if (byte & BIT5) tmp++;
    if (byte & BIT7) tmp++;
    byte = mem.u8[BASE + 0xA751];
    if (byte & BIT3) tmp++;
    if (byte & BIT6) tmp++;
    byte = mem.u8[BASE + 0xA753];
    if (byte & BIT2) tmp++;
    if (byte & BIT4) tmp++;
  }
  state['item.key_small_spirit'] = tmp;
  byte = mem.u8[BASE + 0xA67E];
  state['item.key_boss_spirit'] = (byte & BIT1) ? 1 : 0;
  state['item.compass_temple_spirit'] = (byte & BIT2) ? 1 : 0;
  state['item.dungeon_map_temple_spirit'] = (byte & BIT3) ? 1 : 0;

  types['area/well'] = mem.u8[typeAddr + 0x8] ? 'mq' : 'v';
  tmp = mem.u8[BASE + 0xA694];
  if (tmp == 0xFF) tmp = 0;
  if (types['area/well'] == 'v') {
    byte = mem.u8[BASE + 0xA788];
    if (byte & BIT4) tmp++;
    if (byte & BIT5) tmp++;
    if (byte & BIT6) tmp++;
  }
  else if (types['area/well'] == 'mq') {
    byte = mem.u8[BASE + 0xA789];
    if (byte & BIT5) tmp++;
    if (byte & BIT6) tmp++;
  }
  state['item.key_small_well'] = tmp;
  byte = mem.u8[BASE + 0xA680];
  state['item.compass_well'] = (byte & BIT2) ? 1 : 0;
  state['item.dungeon_map_well'] = (byte & BIT3) ? 1 : 0;

  types['area/temple_shadow'] = mem.u8[typeAddr + 0x7] ? 'mq' : 'v';
  tmp = mem.u8[BASE + 0xA693];
  if (tmp == 0xFF) tmp = 0;
  if (types['area/temple_shadow'] == 'v') {
    byte = mem.u8[BASE + 0xA76C];
    if (byte & BIT1) tmp++;
    if (byte & BIT2) tmp++;
    byte = mem.u8[BASE + 0xA76D];
    if (byte & BIT6) tmp++;
    if (byte & BIT7) tmp++;
    if (byte & BIT8) tmp++;
  }
  else if (types['area/temple_shadow'] == 'mq') {
    byte = mem.u8[BASE + 0xA76C];
    if (byte & BIT1) tmp++;
    if (byte & BIT2) tmp++;
    if (byte & BIT4) tmp++;
    byte = mem.u8[BASE + 0xA76D];
    if (byte & BIT6) tmp++;
    if (byte & BIT7) tmp++;
    if (byte & BIT8) tmp++;
  }
  state['item.key_small_shadow'] = tmp;
  byte = mem.u8[BASE + 0xA67F];
  state['item.key_boss_shadow'] = (byte & BIT1) ? 1 : 0;
  state['item.compass_temple_shadow'] = (byte & BIT2) ? 1 : 0;
  state['item.dungeon_map_temple_shadow'] = (byte & BIT3) ? 1 : 0;

  types['area/training_grounds'] = mem.u8[typeAddr + 0xB] ? 'mq' : 'v';
  tmp = mem.u8[BASE + 0xA697];
  if (tmp == 0xFF) tmp = 0;
  if (types['area/training_grounds'] == 'v') {
    byte = mem.u8[BASE + 0xA7DD];
    if (byte & BIT8) tmp++;
    byte = mem.u8[BASE + 0xA7DE];
    if (byte & BIT2) tmp++;
    if (byte & BIT3) tmp++;
    byte = mem.u8[BASE + 0xA7DF];
    if (byte & BIT2) tmp++;
    if (byte & BIT4) tmp++;
    if (byte & BIT5) tmp++;
    if (byte & BIT6) tmp++;
    if (byte & BIT7) tmp++;
    if (byte & BIT8) tmp++;
  }
  else if (types['area/training_grounds'] == 'mq') {
    byte = mem.u8[BASE + 0xA7DC];
    if (byte & BIT6) tmp++;
    byte = mem.u8[BASE + 0xA7DD];
    if (byte & BIT5) tmp++;
    if (byte & BIT8) tmp++;
  }
  state['item.key_small_training'] = tmp;

  tmp = mem.u8[BASE + 0xA698];
  if (tmp == 0xFF) tmp = 0;
  byte = mem.u8[BASE + 0xA7FB];
  if (byte & BIT2) tmp++;
  if (byte & BIT3) tmp++;
  if (byte & BIT4) tmp++;
  if (byte & BIT5) tmp++;
  state['item.key_small_gerudo'] = tmp;

  types['area/castle_ganon'] = mem.u8[typeAddr + 0xD] ? 'mq' : 'v';
  tmp = mem.u8[BASE + 0xA699];
  if (tmp == 0xFF) tmp = 0;
  if (types['area/castle_ganon'] == 'v') {
    byte = mem.u8[BASE + 0xA814];
    if (byte & BIT6) tmp++;
    if (byte & BIT7) tmp++;
  }
  else if (types['area/castle_ganon'] == 'mq') {
    byte = mem.u8[BASE + 0xA815];
    if (byte & BIT5) tmp++;
    if (byte & BIT6) tmp++;
    if (byte & BIT7) tmp++;
  }
  state['item.key_small_ganon'] = tmp;
  byte = mem.u8[BASE + 0xA682];
  state['item.key_boss_ganon'] = (byte & BIT1) ? 1 : 0;

  for (var item in state) {
    if (prevDungeons[item] != state[item]) {
      var value = state[item];
      prevDungeons[item] = value;
      for (var i = 0; i < clients.length; i++) {
        clients[i].send('2 '+item+' '+value);
      }
      changed = true;
    }
  }
  for (var type in types) {
    if (!prevDungeonTypes[type] || prevDungeonTypes[type].type != types[type]) {
      var value = types[type];
      prevDungeonTypes[type] = {type:value, visited:false};
      // for (var i = 0; i < clients.length; i++) {
      //   clients[i].send('4 '+type+' '+value);
      // }
      changed = true;
    }
  }
}

function findItemLocations() {
  if (findItemLocationsCache != null) return findItemLocationsCache;
  if (pj64.romInfo != null) {
    var rando = mem.u32[0x801C8464];
    if (rando != 0) {
      var coop = mem.u32[rando];
      if (mem.u32[coop] == 2) {
        var begin = mem.u32[rando + 0x8] + 0x1200;
        var end = begin + 0x1000;
        for (var i = begin; i < end; i += 0x4) {
          if (mem.u32[i] == 0x00000101) {
            return i;
          }
        }
      }
    }
  }
  return 0;
}

var ShopItems = [
  'item.nuts_5',
  'item.arrows_30',
  'item.arrows_50',
  'item.bombs_5',
  'item.nuts_10',
  'item.stick_1',
  'item.bombs_10',
  'item.fish_1',
  'item.potion_red_1',
  'item.potion_green_1',
  undefined,
  undefined,
  'item.shield_hylia_1',
  'item.shield_kokiri_1',
  'item.tunic_fire_1',
  'item.tunic_water_1',
  'item.heart_1',
  undefined,
  undefined,
  undefined,
  undefined,
  'item.bombchu_10',
  'item.bombchu_20',
  'item.bombchu_20',
  'item.bombchu_10',
  'item.bombchu_10',
  'item.bombchu_20',
  'item.bombchu_20',
  'item.bombchu_10',
  'item.seeds_30',
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  'item.blue_fire_1',
  'item.bugs_1',
  undefined,
  'item.poe_1',
  'item.fairy_spirit_1',
  'item.arrows_10',
  'item.bombs_20',
  'item.bombs_30',
  'item.bombs_5_2',
  undefined,
  undefined,
];

var RandoItems = {};
RandoItems[0x01] = 'item.refill_item';
RandoItems[0x02] = 'item.refill_item';
RandoItems[0x03] = 'item.bombchu';
RandoItems[0x06] = 'item.boomerang';
RandoItems[0x07] = 'item.refill_item'
RandoItems[0x0A] = 'item.lens';
RandoItems[0x0D] = 'item.hammer';
RandoItems[0x0E] = 'item.cojiro';
RandoItems[0x0F] = 'item.bottle';
RandoItems[0x14] = 'item.milk';
RandoItems[0x15] = 'item.zora_letter';
RandoItems[0x16] = 'item.bean';
RandoItems[0x1D] = 'item.pocket_egg';
RandoItems[0x1E] = 'item.pocket_cucco';
RandoItems[0x1F] = 'item.mushroom';
RandoItems[0x20] = 'item.medicine';
RandoItems[0x21] = 'item.saw';
RandoItems[0x22] = 'item.broken_sword';
RandoItems[0x23] = 'item.prescription';
RandoItems[0x24] = 'item.frog';
RandoItems[0x25] = 'item.eyedrops';
RandoItems[0x26] = 'item.claim';
RandoItems[0x27] = 'item.sword_kokiri';
RandoItems[0x28] = 'item.sword_medigoron';
RandoItems[0x29] = 'item.shield_kokiri';
RandoItems[0x2A] = 'item.shield_hylia';
RandoItems[0x2B] = 'item.shield_mirror';
RandoItems[0x2C] = 'item.tunic_fire';
RandoItems[0x2D] = 'item.tunic_water';
RandoItems[0x2E] = 'item.boots_iron';
RandoItems[0x2F] = 'item.boots_hover';
RandoItems[0x39] = 'item.stone_of_agony';
RandoItems[0x3A] = 'item.membership';
RandoItems[0x3D] = 'item.heart_container';
RandoItems[0x3E] = 'item.heart_piece';
RandoItems[0x47] = 'item.weird_egg';
RandoItems[0x48] = 'item.refill_item';
RandoItems[0x49] = 'item.refill_item';
RandoItems[0x4A] = 'item.refill_item';
RandoItems[0x4B] = 'item.refill_item';
RandoItems[0x4C] = 'item.rupee_green';
RandoItems[0x4D] = 'item.rupee_blue';
RandoItems[0x4E] = 'item.rupee_red';
RandoItems[0x4F] = 'item.heart_container';
RandoItems[0x50] = 'item.milk';
RandoItems[0x55] = 'item.rupee_purple';
RandoItems[0x56] = 'item.rupee_yellow';
RandoItems[0x57] = 'item.sword_biggoron';
RandoItems[0x58] = 'item.arrow_fire';
RandoItems[0x59] = 'item.arrow_ice';
RandoItems[0x5A] = 'item.arrow_light';
RandoItems[0x5B] = 'item.skulltula';
RandoItems[0x5C] = 'item.magic_din';
RandoItems[0x5E] = 'item.magic_nayru';
RandoItems[0x5D] = 'item.magic_farore';
RandoItems[0x64] = 'item.refill_item';
RandoItems[0x66] = 'item.refill_item';
RandoItems[0x67] = 'item.refill_item';
RandoItems[0x69] = 'item.refill_item';
RandoItems[0x6A] = 'item.bombchu';
RandoItems[0x6B] = 'item.bombchu';
RandoItems[0x72] = 'item.rupee_blue';
RandoItems[0x76] = 'item.heart_piece';
RandoItems[0x7C] = 'item.ice_trap';
RandoItems[0x80] = 'item.hookshot';
RandoItems[0x81] = 'item.glove';
RandoItems[0x82] = 'item.bomb_bag';
RandoItems[0x83] = 'item.bow';
RandoItems[0x84] = 'item.slingshot';
RandoItems[0x85] = 'item.wallet';
RandoItems[0x86] = 'item.scale';
RandoItems[0x87] = 'item.nut';
RandoItems[0x88] = 'item.stick';
RandoItems[0x89] = 'item.bombchu';
RandoItems[0x8A] = 'item.magic_power';
RandoItems[0x8B] = 'item.ocarina';
RandoItems[0x8C] = 'item.potion_red';
RandoItems[0x8D] = 'item.potion_green';
RandoItems[0x8E] = 'item.potion_blue';
RandoItems[0x8F] = 'item.fairy_spirit';
RandoItems[0x90] = 'item.fish';
RandoItems[0x91] = 'item.blue_fire';
RandoItems[0x92] = 'item.bugs';
RandoItems[0x93] = 'item.poe_big';
RandoItems[0x94] = 'item.poe';
RandoItems[0x95] = 'item.key_boss_forest';
RandoItems[0x96] = 'item.key_boss_fire';
RandoItems[0x97] = 'item.key_boss_water';
RandoItems[0x98] = 'item.key_boss_spirit';
RandoItems[0x99] = 'item.key_boss_shadow';
RandoItems[0x9A] = 'item.key_boss_ganon';
RandoItems[0x9B] = 'item.compass_deku';
RandoItems[0x9C] = 'item.compass_dodongo';
RandoItems[0x9D] = 'item.compass_jabujabu';
RandoItems[0x9E] = 'item.compass_temple_forest';
RandoItems[0x9F] = 'item.compass_temple_fire';
RandoItems[0xA0] = 'item.compass_temple_water';
RandoItems[0xA1] = 'item.compass_temple_spirit';
RandoItems[0xA2] = 'item.compass_temple_shadow';
RandoItems[0xA3] = 'item.compass_well';
RandoItems[0xA4] = 'item.compass_ice';
RandoItems[0xA5] = 'item.dungeon_map_deku';
RandoItems[0xA6] = 'item.dungeon_map_dodongo';
RandoItems[0xA7] = 'item.dungeon_map_jabujabu';
RandoItems[0xA8] = 'item.dungeon_map_temple_forest';
RandoItems[0xA9] = 'item.dungeon_map_temple_fire';
RandoItems[0xAA] = 'item.dungeon_map_temple_water';
RandoItems[0xAB] = 'item.dungeon_map_temple_spirit';
RandoItems[0xAC] = 'item.dungeon_map_temple_shadow';
RandoItems[0xAD] = 'item.dungeon_map_well';
RandoItems[0xAE] = 'item.dungeon_map_ice';
RandoItems[0xAF] = 'item.key_small_forest';
RandoItems[0xB0] = 'item.key_small_fire';
RandoItems[0xB1] = 'item.key_small_water';
RandoItems[0xB2] = 'item.key_small_spirit';
RandoItems[0xB3] = 'item.key_small_shadow';
RandoItems[0xB4] = 'item.key_small_well';
RandoItems[0xB5] = 'item.key_small_training';
RandoItems[0xB6] = 'item.key_small_gerudo';
RandoItems[0xB7] = 'item.key_small_ganon';
RandoItems[0xB8] = 'item.heart_double';
RandoItems[0xC9] = 'item.bean';
RandoItems[0xCA] = 'item.triforce_piece';
RandoItems[0xBB] = 'item.warp_forest';
RandoItems[0xBC] = 'item.warp_fire';
RandoItems[0xBD] = 'item.warp_water';
RandoItems[0xBE] = 'item.warp_spirit';
RandoItems[0xBF] = 'item.warp_shadow';
RandoItems[0xC0] = 'item.warp_light';
RandoItems[0xC1] = 'item.song_zelda';
RandoItems[0xC2] = 'item.song_epona';
RandoItems[0xC3] = 'item.song_saria';
RandoItems[0xC4] = 'item.song_sun';
RandoItems[0xC5] = 'item.song_time';
RandoItems[0xC6] = 'item.song_storm';

function checkShops() {
  var listAddr;
  var invAddr;
  var shop;
  var inv = {};
  var bought;
  var randoItems = [];
  var scene = mem.u16[0x801C8544];
  if (scene == 0x2D) {
    var start = 0x801E0000;
    for (var i = start; i < start+0x20000; i += 0x4) {
      if (mem.u32[i] == 0x00BB0011) {
        listAddr = i;
        break;
      }
    }
    invAddr = 0x801E7B00 + 0x00;
    shop = 'shop.kokiri/';
    bought = mem.u8[0x8011AB84] & 0x0F;
    var items = findItemLocations();
    if (items) {
      for (var i = items; i < items + 0x1000; i += 0x4) {
        var loc = mem.u32[i];
        if (
             loc == 0x002D0034
          || loc == 0x002D0035
          || loc == 0x002D0036
          || loc == 0x002D0037
        ) {
          randoItems.push({item:RandoItems[mem.u16[i+4]],player:mem.u8[i+6]});
        }
        if (loc == 0x002D0037) break;
      }
    }
  }
  else if (scene == 0x30 && mem.u32[0x8011A5D4] == 0) {
    listAddr = 0x801EC54C;
    invAddr = 0x801E7B00 + 0x40;
    shop = 'shop.magic_adult/';
    bought = mem.u8[0x8011AB86] >> 4;
    var items = findItemLocations();
    if (items) {
      for (var i = items; i < items + 0x1000; i += 0x4) {
        var loc = mem.u32[i];
        if (
             loc == 0x00300034
          || loc == 0x00300035
          || loc == 0x00300036
          || loc == 0x00300037
        ) {
          randoItems.push({item:RandoItems[mem.u16[i+4]],player:mem.u8[i+6]});
        }
        if (loc == 0x00300037) break;
      }
    }
  }
  else if (scene == 0x2C && mem.u32[0x8011A5D4] == 0) {
    listAddr = 0x801F143C;
    invAddr = 0x801E7F40 + 0x140;
    shop = 'shop.basar_adult/';
    bought = mem.u8[0x8011AB84] >> 4;
    var items = findItemLocations();
    if (items) {
      for (var i = items; i < items + 0x1000; i += 0x4) {
        var loc = mem.u32[i];
        if (
             loc == 0x002C003D
          || loc == 0x002C003E
          || loc == 0x002C003F
          || loc == 0x002C0040
        ) {
          randoItems.push({item:RandoItems[mem.u16[i+4]],player:mem.u8[i+6]});
        }
        if (loc == 0x002C0040) break;
      }
    }
  }
  else if (scene == 0x2C && mem.u32[0x8011A5D4] == 1) {
    listAddr = 0x801F510C;
    invAddr = 0x801E7F40 + 0x100;
    shop = 'shop.basar_child/';
    bought = mem.u8[0x8011AB85] & 0x0F;
    var items = findItemLocations();
    if (items) {
      for (var i = items; i < items + 0x1000; i += 0x4) {
        var loc = mem.u32[i];
        if (
             loc == 0x002C0034
          || loc == 0x002C0035
          || loc == 0x002C0036
          || loc == 0x002C0037
        ) {
          randoItems.push({item:RandoItems[mem.u16[i+4]],player:mem.u8[i+6]});
        }
        if (loc == 0x002C0037) break;
      }
    }
  }
  else if (scene == 0x2E) {
    listAddr = 0x801EAE8C;
    invAddr = 0x801E7B00 + 0x200;
    shop = 'shop.goron/';
    bought = mem.u8[0x8011AB85] >> 4;
    var items = findItemLocations();
    if (items) {
      for (var i = items; i < items + 0x1000; i += 0x4) {
        var loc = mem.u32[i];
        if (
             loc == 0x002E0034
          || loc == 0x002E0035
          || loc == 0x002E0036
          || loc == 0x002E0037
        ) {
          randoItems.push({item:RandoItems[mem.u16[i+4]],player:mem.u8[i+6]});
        }
        if (loc == 0x002E0037) break;
      }
    }
  }
  else if (scene == 0x31) {
    listAddr = 0x801EEAFC;
    invAddr = 0x801E7B00 + 0xC0;
    shop = 'shop.magic_child/';
    bought = mem.u8[0x8011AB87] & 0x0F;
    var items = findItemLocations();
    if (items) {
      for (var i = items; i < items + 0x1000; i += 0x4) {
        var loc = mem.u32[i];
        if (
             loc == 0x00310034
          || loc == 0x00310035
          || loc == 0x00310036
          || loc == 0x00310037
        ) {
          randoItems.push({item:RandoItems[mem.u16[i+4]],player:mem.u8[i+6]});
        }
        if (loc == 0x00310037) break;
      }
    }
  }
  else if (scene == 0x32) {
    listAddr = 0x801EAE2C;
    invAddr = 0x801E7B00 + 0x80;
    shop = 'shop.bombchu/';
    bought = mem.u8[0x8011AB87] >> 4;
    var items = findItemLocations();
    if (items) {
      for (var i = items; i < items + 0x1000; i += 0x4) {
        var loc = mem.u32[i];
        if (
             loc == 0x00320034
          || loc == 0x00320035
          || loc == 0x00320036
          || loc == 0x00320037
        ) {
          randoItems.push({item:RandoItems[mem.u16[i+4]],player:mem.u8[i+6]});
        }
        if (loc == 0x00320037) break;
      }
    }
  }
  else if (scene == 0x2F) {
    listAddr = 0x801EDB5C;
    invAddr = 0x801E7B00 + 0x1C0;
    shop = 'shop.zora/';
    bought = mem.u8[0x8011AB86] & 0x0F;
    var items = findItemLocations();
    if (items) {
      for (var i = items; i < items + 0x1000; i += 0x4) {
        var loc = mem.u32[i];
        if (
             loc == 0x002F0034
          || loc == 0x002F0035
          || loc == 0x002F0036
          || loc == 0x002F0037
        ) {
          randoItems.push({item:RandoItems[mem.u16[i+4]],player:mem.u8[i+6]});
        }
        if (loc == 0x002F0037) break;
      }
    }
  }
  else return;
  var list = [];
  for (var i = listAddr; i <= listAddr + 0xA20; i += 0x20) {
    list.push({
      item: ShopItems[list.length],
      price: mem.u16[i+8],
      bought: false,
      player: ''
    });
  }
  var x = 0;
  inv[shop+6] = list[mem.u16[invAddr]];
  inv[shop+2] = list[mem.u16[invAddr + 0x8 * 1]];
  inv[shop+7] = list[mem.u16[invAddr + 0x8 * 2]];
  inv[shop+3] = list[mem.u16[invAddr + 0x8 * 3]];
  inv[shop+5] = list[mem.u16[invAddr + 0x8 * 4]];
  if (inv[shop+5].item == undefined) {
    inv[shop+5].item = randoItems[x].item;
    inv[shop+5].player = 'Player '+randoItems[x].player;
    inv[shop+5].bought = (bought & BIT1) ? true : false;
    x++;
  }
  inv[shop+1] = list[mem.u16[invAddr + 0x8 * 5]];
  if (inv[shop+1].item == undefined) {
    inv[shop+1].item = randoItems[x].item;
    inv[shop+1].player = 'Player '+randoItems[x].player;
    inv[shop+1].bought = (bought & BIT2) ? true : false;
    x++;
  }
  inv[shop+4] = list[mem.u16[invAddr + 0x8 * 6]];
  if (inv[shop+4].item == undefined) {
    inv[shop+4].item = randoItems[x].item;
    inv[shop+4].player = 'Player '+randoItems[x].player;
    inv[shop+4].bought = (bought & BIT3) ? true : false;
    x++;
  }
  inv[shop+0] = list[mem.u16[invAddr + 0x8 * 7]];
  if (inv[shop+0].item == undefined) {
    inv[shop+0].item = randoItems[x].item;
    inv[shop+0].player = 'Player '+randoItems[x].player;
    inv[shop+0].bought = (bought & BIT4) ? true : false;
    x++;
  }

  for (var item in inv) {
    if (
         !shops[item]
      || inv[item].item != shops[item].item
      || inv[item].price != shops[item].price
      || inv[item].bought != shops[item].bought
      || inv[item].player != shops[item].player
    ) {
      var value = inv[item];
      shops[item] = value;
      for (var i = 0; i < clients.length; i++) {
        clients[i].send('3 '+item+' '+value.item+' '+value.price+' '+value.bought+' '+value.player);
      }
      changed = true;
    }
  }
}

// var Locations = {"area/kokiri":{"subexit/kokiri.links_house":{},"subexit/kokiri.midos_house":{},"subexit/kokiri.know_it_house":{},"subexit/kokiri.sarias_house":{},"subexit/kokiri.twins_house":{},"subexit/kokiri.shop":{},"subexit/kokiri.storm_grotto":{},"exit/kokiri_forest.kokiri_bridge_gateway":{},"exit/kokiri_forest.kokiri_woods_gateway":{}},"area/desert":{"exit/wasteland_near_fortress.wasteland_fortress_gateway":{},"exit/wasteland_near_colossus.wasteland_colossus_gateway":{}},"area/colossus":{"subexit/desert.fairy_fountain":{},"subexit/desert.strength_grotto":{},"exit/desert_colossus.wasteland_colossus_gateway":{}},"area/river":{"subexit/river.bomb_grotto":{},"subexit/river.open_grotto":{},"subexit/river.storms_grotto":{},"exit/zr_front.river_field_gateway":{},"exit/zora_river.river_woods_gateway":{},"exit/zr_behind_waterfall.river_domain_gateway":{}},"area/hyrule_field":{"subexit/hyrule_field.kakariko_grotto":{},"subexit/hyrule_field.lake_fence_grotto":{},"subexit/hyrule_field.lake_open_grotto":{},"subexit/hyrule_field.dive_grotto":{},"subexit/hyrule_field.valley_grotto":{},"subexit/hyrule_field.castle_entrance_grotto":{},"subexit/hyrule_field.fairy_grotto":{},"subexit/hyrule_field.little_forest_grotto":{},"exit/hyrule_field.field_woods_gateway":{},"exit/hyrule_field.lake_field_gateway":{},"exit/hyrule_field.marketentrance_field_gateway":{},"exit/hyrule_field.ranch_field_gateway":{},"exit/hyrule_field.kakariko_field_gateway":{},"exit/hyrule_field.river_field_gateway":{},"exit/hyrule_field.valley_field_gateway":{}},"area/gerudo_valley":{"subexit/gerudo_valley.tend":{},"subexit/gerudo_valley.octorock_grotto":{},"subexit/gerudo_valley.storms_grotto":{},"exit/gerudo_valley.valley_field_gateway":{},"exit/gv_fortress_side.valley_fortress_gateway":{}},"area/lake":{"subexit/lake.laboratory":{},"subexit/lake.fishing":{},"subexit/lake.grave_grotto":{},"exit/lake_hylia.lake_field_gateway":{},"exit/lake_hylia.domain_lake_gateway":{},"exit/lh.owl_flight":{}},"area/lonlon":{"subexit/lonlon.house":{},"subexit/lonlon.stables":{},"subexit/lonlon.silo":{},"subexit/lonlon.open_grotto":{},"exit/lon_lon_ranch.ranch_field_gateway":{}},"area/gerudo":{"subexit/gerudo.storms_grotto":{},"exit/gerudo_fortress.valley_fortress_gateway":{},"exit/gf_outside_gate.wasteland_fortress_gateway":{}},"area/woods":{"subexit/woods.near_goron_grotto":{},"subexit/woods.theatre_grotto":{},"subexit/woods.near_meadow_grotto":{},"exit/lw_bridge.field_woods_gateway":{},"exit/lw_bridge.kokiri_bridge_gateway":{},"exit/lost_woods.kokiri_woods_gateway":{},"exit/lost_woods.gc_woods_gateway":{},"exit/lost_woods.river_woods_gateway":{},"exit/lw_beyond_mido.meadow_woods_gateway":{}},"area/meadow":{"subexit/meadow.wolfos_grotto":{},"subexit/meadow.fairy_grotto":{},"subexit/meadow.storms_grotto":{},"exit/sfm_entryway.meadow_woods_gateway":{}},"area/town_entrance":{"subexit/castle_town.guard_tower":{},"exit/market_entrance.marketentrance_field_gateway":{},"exit/market_entrance.marketentrance_market_gateway":{}},"area/castle_town":{"subexit/castle_town.shop_bombchu":{},"subexit/castle_town.shop_bazaar":{},"subexit/castle_town.shop_magic":{},"subexit/castle_town.shop_mask":{},"subexit/castle_town.minigame_bombchu":{},"subexit/castle_town.minigame_shooting":{},"subexit/castle_town.minigame_treasure":{},"subexit/castle_town.back_house":{},"exit/market.marketentrance_market_gateway":{},"exit/market.grounds_market_gateway":{},"exit/market.tot_market_gateway":{}},"area/temple_time":{"subexit/castle_town.temple_of_time":{},"exit/tot_entrance.tot_market_gateway":{}},"area/castle":{"subexit/castle.fairy_young":{},"subexit/castle.storm_grotto":{},"exit/castle_grounds.grounds_market_gateway":{}},"area/castle_ganon_outside":{"subexit/castle.fairy_adult":{},"exit/castle_grounds.grounds_market_gateway":{}},"area/kakariko":{"subexit/kakariko.shop_bazaar":{},"subexit/kakariko.shop_magic":{},"subexit/kakariko.shop_magic_back":{},"subexit/kakariko.minigame_shooting":{},"subexit/kakariko.impas_house":{},"subexit/kakariko.impa_back":{},"subexit/kakariko.windmill":{},"subexit/kakariko.skulltula_house":{},"subexit/kakariko.kakariko_witch":{},"subexit/kakariko.carpenter_house":{},"subexit/kakariko.open_grotto":{},"subexit/kakariko.redead_grotto":{},"exit/kakariko_village.kakariko_field_gateway":{},"exit/kakariko_village.graveyard_kakariko_gateway":{},"exit/kak_behind_gate.mountain_kakariko_gateway":{}},"area/graveyard":{"subexit/graveyard.dampes_hut":{},"subexit/graveyard.dampes_grave":{},"subexit/graveyard.shield_grave":{},"subexit/graveyard.redead_grave":{},"subexit/graveyard.royal_grave":{},"exit/graveyard.graveyard_kakariko_gateway":{}},"area/mountain":{"subexit/mountain.fairy_fountain":{},"subexit/mountain.bomb_grotto":{},"subexit/mountain.storms_grotto":{},"exit/death_mountain.mountain_kakariko_gateway":{},"exit/death_mountain.mountain_goron_gateway":{},"exit/death_mountain_summit.crater_mountain_gateway":{},"exit/dmt.owl_flight":{}},"area/crater":{"subexit/crater.fairy_fountain":{},"subexit/crater.hammer_grotto":{},"subexit/crater.bomb_grotto":{},"exit/dmc_upper_local.crater_mountain_gateway":{},"exit/dmc_lower_local.crater_goron_gateway":{}},"area/goron":{"subexit/goron.shop":{},"subexit/goron.grotto":{},"exit/gc_darunias_chamber.crater_goron_gateway":{},"exit/goron_city.mountain_goron_gateway":{},"exit/gc_woods_warp.gc_woods_gateway":{}},"area/zoras":{"subexit/zoras.shop":{},"subexit/zoras.storms_grotto":{},"exit/zoras_domain.river_domain_gateway":{},"exit/zoras_domain.domain_lake_gateway":{},"exit/zd_behind_king_zora.fountain_domain_gateway":{}},"area/fountain":{"subexit/fountain.fairy_fountain":{},"exit/zoras_fountain.fountain_domain_gateway":{}},"area/deku":{},"area/dodongo":{},"area/jabujabu":{},"area/temple_forest":{},"area/temple_fire":{},"area/temple_water":{},"area/temple_shadow":{},"area/temple_spirit":{},"area/well":{},"area/ice_cavern":{},"area/training_grounds":{},"area/castle_ganon":{},"overworld":{"exit/child.spawn":{},"exit/adult.spawn":{},"exit/prelude":{},"exit/minuet":{},"exit/bolero":{},"exit/serenade":{},"exit/nocturne":{},"exit/requiem":{},"exit/deku":{},"exit/dodongo":{},"exit/jabujabu":{},"exit/temple_forest":{},"exit/temple_fire":{},"exit/temple_water":{},"exit/temple_shadow":{},"exit/temple_spirit":{},"exit/well":{},"exit/ice_cavern":{},"exit/training_grounds":{}}};

var EntranceIndexToTrackerEntrance = {
  //kokiri
  0x0000: 'region.deku_tree_gateway -> region.deku_tree_entrance',
  0x05E0: 'region.bridge_kokiri_gateway -> region.kokiri_bridge_gateway',
  0x0272: 'region.kf_links_house -> region.kf_links_house_entrance',
  0x00C1: 'region.kf_kokiri_shop -> region.kf_kokiri_shop_entrance',
  0x00C9: 'region.kf_know_it_all_house -> region.kf_know_it_all_house_entrance',
  0x011E: 'region.woods_kokiri_gateway -> region.kokiri_woods_gateway',
  0x009C: 'region.kf_house_of_twins -> region.kf_house_of_twins_entrance',
  0x0433: 'region.kf_midos_house -> region.kf_midos_house_entrance',
  0x0437: 'region.kf_sarias_house -> region.kf_sarias_house_entrance',
  0x0209: 'region.kokiri_forest -> region.kf_midos_house_entrance',
  0x0211: 'region.kokiri_forest -> region.kf_midos_house_entrance',
  0x0266: 'region.kokiri_forest -> region.kf_midos_house_entrance',
  0x026A: 'region.kokiri_forest -> region.kf_midos_house_entrance',
  0x033C: 'region.kokiri_forest -> region.kf_midos_house_entrance',
  0x0443: 'region.kokiri_forest -> region.kf_midos_house_entrance',
  0x0447: 'region.kokiri_forest -> region.kf_midos_house_entrance',
  //woods
  0x0286: 'region.kokiri_woods_gateway -> region.woods_kokiri_gateway',
  0x00FC: 'region.meadow_woods_gateway -> region.woods_meadow_gateway',
  0x04E2: 'region.gc_woods_gateway -> region.woods_gc_gateway',
  0x01DD: 'region.river_woods_gateway -> region.woods_river_gateway',
  0x0185: 'region.field_woods_gateway -> region.woods_field_gateway',
  0x020D: 'region.kokiri_bridge_gateway -> region.bridge_kokiri_gateway',
  0x01AD: 'region.lost_woods -> region.lw_near_shortcuts_grotto_entrance',
  0x01B1: 'region.lost_woods -> region.lw_near_shortcuts_grotto_entrance',
  0x04C6: 'region.lost_woods -> region.lw_near_shortcuts_grotto_entrance',
  0x04D2: 'region.lw_beyond_mido -> region.deku_theater_entrance',
  //meadow
  0x01A9: 'region.woods_meadow_gateway -> region.meadow_woods_gateway',
  0x0169: 'region.forest_temple_gateway -> region.forest_temple_entrance',
  //river
  0x0181: 'region.field_river_gateway -> region.river_field_gateway',
  0x0108: 'region.domain_river_gateway -> region.river_domain_gateway',
  0x04DA: 'region.woods_river_gateway -> region.river_woods_gateway',
  //zoras
  0x019D: 'region.river_domain_gateway -> region.domain_river_gateway',
  0x0225: 'region.fountain_domain_gateway -> region.domain_fountain_gateway',
  0x0380: 'region.zd_shop -> region.zd_shop_entrance',
  0x0560: 'region.lake_domain_gateway -> region.domain_lake_gateway',
  0x03C4: 'region.zoras_domain -> region.zd_storms_grotto_entrance',
  //fountain
  0x0028: 'region.jabu_jabus_belly_gateway -> region.jabu_jabus_belly_entrance',
  0x01A1: 'region.domain_fountain_gateway -> region.fountain_domain_gateway',
  0x0088: 'region.ice_cavern_gateway -> region.ice_cavern_entrance',
  0x0371: 'region.zf_great_fairy_fountain -> region.zf_great_fairy_fountain_entrance',
  0x0221: 'region.zoras_fountain -> region.zf_great_fairy_fountain_entrance',
  0x03D4: 'region.zoras_fountain -> region.zf_great_fairy_fountain_entrance',
  0x0394: 'region.zoras_fountain -> region.zf_great_fairy_fountain_entrance',
  //kakariko
  0x017D: 'region.field_kakariko_gateway -> region.kakariko_field_gateway',
  0x013D: 'region.mountain_kakariko_gateway -> region.kakariko_mountain_gateway',
  0x00E4: 'region.graveyard_kakariko_gateway -> region.kakariko_graveyard_gateway',
  0x00B7: 'region.kak_bazaar -> region.kak_bazaar_entrance',
  0x0098: 'region.bottom_of_the_well_gateway -> region.bottom_of_the_well_entrance',
  0x039C: 'region.kak_impas_house -> region.kak_impas_house_entrance',
  0x02FD: 'region.kak_carpenter_boss_house -> region.kak_carpenter_boss_house_entrance',
  0x0072: 'region.kak_odd_medicine_building -> region.kak_odd_medicine_building_entrance',
  0x0453: 'region.kak_windmill -> region.kak_windmill_entrance',
  0x0384: 'region.kak_potion_shop_front -> region.kak_potion_shop_front_entrance',
  0x003B: 'region.kak_shooting_gallery -> region.kak_shooting_gallery_entrance',
  0x0550: 'region.kak_house_of_skulltula -> region.kak_house_of_skulltula_entrance',
  0x03EC: 'region.kak_potion_shop_back -> region.kak_potion_shop_back_entrance',
  0x05C8: 'region.kak_impas_house_back -> region.kak_impas_house_back_entrance',
  0x0201: 'region.kakariko_village -> region.kak_bazaar_entrance',
  0x02A6: 'region.kakariko_village -> region.kak_bazaar_entrance',
  0x0345: 'region.kakariko_village -> region.kak_bazaar_entrance',
  0x0349: 'region.kakariko_village -> region.kak_bazaar_entrance',
  0x034D: 'region.kak_backyard -> region.kak_odd_medicine_building_entrance',
  0x0351: 'region.kakariko_village -> region.kak_bazaar_entrance',
  0x044B: 'region.kakariko_village -> region.kak_bazaar_entrance',
  0x0463: 'region.kakariko_village -> region.kak_bazaar_entrance',
  0x04EE: 'region.kakariko_village -> region.kak_bazaar_entrance',
  0x04FF: 'region.kak_backyard -> region.kak_odd_medicine_building_entrance',
  0x05DC: 'region.kakariko_village -> region.kak_bazaar_entrance',
  //graveyard
  0x0195: 'region.kakariko_graveyard_gateway -> region.graveyard_kakariko_gateway',
  0x0037: 'region.shadow_temple_gateway -> region.shadow_temple_entrance',
  0x030D: 'region.graveyard_dampes_house -> region.graveyard_dampes_house_entrance',
  0x044F: 'region.graveyard_dampes_grave -> region.graveyard_dampes_grave_entrance',
  0x004B: 'region.graveyard_shield_grave -> region.graveyard_shield_grave_entrance',
  0x031C: 'region.graveyard_heart_piece_grave -> region.graveyard_heart_piece_grave_entrance',
  0x002D: 'region.graveyard_composers_grave -> region.graveyard_composers_grave_entrance',
  0x0205: 'region.graveyard_warp_pad_region -> region.nocturne_of_shadow_warp',
  0x0355: 'region.graveyard -> region.graveyard_dampes_grave_entrance',
  0x0359: 'region.graveyard -> region.graveyard_dampes_grave_entrance',
  0x035D: 'region.graveyard -> region.graveyard_dampes_grave_entrance',
  0x0361: 'region.graveyard -> region.graveyard_dampes_grave_entrance',
  0x050B: 'region.graveyard -> region.graveyard_dampes_grave_entrance',
  //mountain
  0x0191: 'region.kakariko_mountain_gateway -> region.mountain_kakariko_gateway',
  0x014D: 'region.goron_mountain_gateway -> region.mountain_goron_gateway',
  0x0147: 'region.crater_mountain_gateway -> region.mountain_crater_gateway',
  0x0004: 'region.dodongos_cavern_gateway -> region.dodongos_cavern_entrance',
  0x0315: 'region.dmt_great_fairy_fountain -> region.dmt_great_fairy_fountain_entrance',
  0x0242: 'region.death_mountain -> region.dmt_storms_grotto_entrance',
  0x045B: 'region.death_mountain_summit -> region.dmt_great_fairy_fountain_entrance',
  //goron
  0x01B9: 'region.mountain_goron_gateway -> region.goron_mountain_gateway',
  0x0246: 'region.crater_goron_gateway -> region.goron_crater_gateway',
  0x037C: 'region.gc_shop -> region.gc_shop_entrance',
  0x04D6: 'region.woods_gc_gateway -> region.gc_woods_gateway',
  0x03FC: 'region.goron_city -> region.gc_shop_entrance',
  //crater
  0x01BD: 'region.mountain_crater_gateway -> region.crater_mountain_gateway',
  0x01C1: 'region.goron_crater_gateway -> region.crater_goron_gateway',
  0x0165: 'region.fire_temple_gateway -> region.fire_temple_entrance',
  0x04BE: 'region.dmc_great_fairy_fountain -> region.dmc_great_fairy_fountain_entrance',
  0x024A: 'region.dmc_central_local -> region.bolero_of_fire_warp',
  0x0482: 'region.dmc_lower_nearby -> region.dmc_hammer_grotto_entrance',
  //market_entrance
  0x00B1: 'region.market_marketentrance_gateway -> region.marketentrance_market_gateway',
  0x01FD: 'region.field_marketentrance_gateway -> region.marketentrance_field_gateway',
  0x007E: 'region.market_guard_house -> region.market_guard_house_entrance',
  0x026E: 'region.market_entrance -> region.market_guard_house_entrance',
  //market
  0x0033: 'region.marketentrance_market_gateway -> region.market_marketentrance_gateway',
  0x0138: 'region.grounds_market_gateway -> region.market_grounds_gateway',
  0x0171: 'region.tot_market_gateway -> region.market_tot_gateway',
  0x0388: 'region.market_potion_shop -> region.market_potion_shop_entrance',
  0x052C: 'region.market_bazaar -> region.market_bazaar_entrance',
  0x0507: 'region.market_bombchu_bowling -> region.market_bombchu_bowling_entrance',
  0x016D: 'region.market_shooting_gallery -> region.market_shooting_gallery_entrance',
  0x0530: 'region.market_mask_shop -> region.market_mask_shop_entrance',
  0x0063: 'region.market_treasure_chest_game -> region.market_treasure_chest_game_entrance',
  0x0528: 'region.market_bombchu_shop -> region.market_bombchu_shop_entrance',
  0x043B: 'region.market_man_in_green_house -> region.market_man_in_green_house_entrance',
  0x02A2: 'region.market -> region.market_mask_shop_entrance',
  0x03B8: 'region.market -> region.market_mask_shop_entrance',
  0x03BC: 'region.market -> region.market_mask_shop_entrance',
  0x01CD: 'region.market -> region.market_mask_shop_entrance',
  0x01D1: 'region.market -> region.market_mask_shop_entrance',
  0x01D5: 'region.market -> region.market_mask_shop_entrance',
  0x03C0: 'region.market -> region.market_mask_shop_entrance',
  0x0067: 'region.market -> region.market_mask_shop_entrance',
  //temple_time
  0x025E: 'region.market_tot_gateway -> region.tot_market_gateway',
  0x0053: 'region.temple_of_time -> region.tot_entrance',
  0x0472: 'region.tot_market_gateway -> region.market_tot_gateway',
  //castle
  0x025A: 'region.market_grounds_gateway -> region.grounds_market_gateway',
  0x0578: 'region.hc_great_fairy_fountain -> region.hc_great_fairy_fountain_entrance',
  0x0340: 'region.grounds_market_gateway -> region.market_grounds_gateway',
  //castle_ganon
  0x025A: 'region.market_grounds_gateway -> region.grounds_market_gateway',
  0x04C2: 'region.ogc_great_fairy_fountain -> region.ogc_great_fairy_fountain_entrance',
  0x0340: 'region.grounds_market_gateway -> region.market_grounds_gateway',
  //hyrule_field
  0x00DB: 'region.kakariko_field_gateway -> region.field_kakariko_gateway',
  0x00EA: 'region.river_field_gateway -> region.field_river_gateway',
  0x04DE: 'region.woods_field_gateway -> region.field_woods_gateway',
  0x0102: 'region.lake_field_gateway -> region.field_lake_gateway',
  0x0117: 'region.valley_field_gateway -> region.field_valley_gateway',
  0x0157: 'region.ranch_field_gateway -> region.field_ranch_gateway',
  0x0276: 'region.marketentrance_field_gateway -> region.field_marketentrance_gateway',
  //lonlon
  0x01F9: 'region.field_ranch_gateway -> region.ranch_field_gateway',
  0x004F: 'region.llr_talons_house -> region.llr_talons_house_entrance',
  0x02F9: 'region.llr_stables -> region.llr_stables_entrance',
  0x05D0: 'region.llr_tower -> region.llr_tower_entrance',
  0x0378: 'region.lon_lon_ranch -> region.llr_grotto_entrance',
  0x042F: 'region.lon_lon_ranch -> region.llr_grotto_entrance',
  0x05D4: 'region.lon_lon_ranch -> region.llr_grotto_entrance',
  //lake
  0x0189: 'region.field_lake_gateway -> region.lake_field_gateway',
  0x0010: 'region.water_temple_gateway -> region.water_temple_entrance',
  0x0043: 'region.lh_lab -> region.lh_lab_entrance',
  0x045F: 'region.lh_fishing_hole -> region.lh_fishing_hole_entrance',
  0x0328: 'region.domain_lake_gateway -> region.lake_domain_gateway',
  0x021D: 'region.lake_hylia -> region.lh_grotto_entrance',
  0x03CC: 'region.lake_hylia -> region.lh_grotto_entrance',
  0x0309: 'region.lh_fishing_island -> region.lh_fishing_hole_entrance',
  //gerudo_valley
  0x018D: 'region.field_valley_gateway -> region.valley_field_gateway',
  0x0129: 'region.fortress_valley_gateway -> region.valley_fortress_gateway',
  0x03A0: 'region.gv_carpenter_tent -> region.gv_carpenter_tent_entrance',
  0x03D0: 'region.gv_fortress_side -> region.gv_storms_grotto_entrance',
  //gerudo_fortress
  0x022D: 'region.valley_fortress_gateway -> region.fortress_valley_gateway',
  0x0008: 'region.gerudo_training_grounds_gateway -> region.gerudo_training_grounds_entrance',
  0x0130: 'region.wasteland_fortress_gateway -> region.fortress_wasteland_gateway',
  0x03A8: 'region.gerudo_fortress -> region.gf_storms_grotto_entrance',
  //desert
  0x03AC: 'region.fortress_wasteland_gateway -> region.wasteland_fortress_gateway',
  0x0123: 'region.colossus_wasteland_gateway -> region.wasteland_colossus_gateway',
  //colossus
  0x0365: 'region.wasteland_colossus_gateway -> region.colossus_wasteland_gateway',
  0x0082: 'region.spirit_temple_gateway -> region.spirit_temple_entrance',
  0x0588: 'region.colossus_great_fairy_fountain -> region.colossus_great_fairy_fountain_entrance',
  0x01E1: 'region.desert_colossus -> region.colossus_grotto_entrance',
  0x057C: 'region.desert_colossus -> region.colossus_grotto_entrance',
  //grottos
  0x1000: 'region.colossus_grotto -> region.colossus_grotto_entrance',
  0x1001: 'region.lh_grotto -> region.lh_grotto_entrance',
  0x1002: 'region.zr_storms_grotto -> region.zr_storms_grotto_entrance',
  0x1003: 'region.zr_fairy_grotto -> region.zr_fairy_grotto_entrance',
  0x1004: 'region.zr_open_grotto -> region.zr_open_grotto_entrance',
  0x1005: 'region.dmc_hammer_grotto -> region.dmc_hammer_grotto_entrance',
  0x1006: 'region.dmc_upper_grotto -> region.dmc_upper_grotto_entrance',
  0x1007: 'region.gc_grotto -> region.gc_grotto_entrance',
  0x1008: 'region.dmt_storms_grotto -> region.dmt_storms_grotto_entrance',
  0x1009: 'region.dmt_cow_grotto -> region.dmt_cow_grotto_entrance',
  0x100A: 'region.kak_open_grotto -> region.kak_open_grotto_entrance',
  0x100B: 'region.kak_redead_grotto -> region.kak_redead_grotto_entrance',
  0x100C: 'region.hc_storms_grotto -> region.hc_storms_grotto_entrance',
  0x100D: 'region.hf_tektite_grotto -> region.hf_tektite_grotto_entrance',
  0x100E: 'region.hf_near_kak_grotto -> region.hf_near_kak_grotto_entrance',
  0x100F: 'region.hf_fairy_grotto -> region.hf_fairy_grotto_entrance',
  0x1010: 'region.hf_near_market_grotto -> region.hf_near_market_grotto_entrance',
  0x1011: 'region.hf_cow_grotto -> region.hf_cow_grotto_entrance',
  0x1012: 'region.hf_inside_fence_grotto -> region.hf_inside_fence_grotto_entrance',
  0x1013: 'region.hf_open_grotto -> region.hf_open_grotto_entrance',
  0x1014: 'region.hf_southeast_grotto -> region.hf_southeast_grotto_entrance',
  0x1015: 'region.llr_grotto -> region.llr_grotto_entrance',
  0x1016: 'region.sfm_wolfos_grotto -> region.sfm_wolfos_grotto_entrance',
  0x1017: 'region.sfm_storms_grotto -> region.sfm_storms_grotto_entrance',
  0x1018: 'region.sfm_fairy_grotto -> region.sfm_fairy_grotto_entrance',
  0x1019: 'region.lw_scrubs_grotto -> region.lw_scrubs_grotto_entrance',
  0x101A: 'region.lw_near_shortcuts_grotto -> region.lw_near_shortcuts_grotto_entrance',
  0x101B: 'region.kf_storms_grotto -> region.kf_storms_grotto_entrance',
  0x101C: 'region.zd_storms_grotto -> region.zd_storms_grotto_entrance',
  0x101D: 'region.gf_storms_grotto -> region.gf_storms_grotto_entrance',
  0x101E: 'region.gv_storms_grotto -> region.gv_storms_grotto_entrance',
  0x101F: 'region.gv_octorok_grotto -> region.gv_octorok_grotto_entrance',
  0x1020: 'region.deku_theater -> region.deku_theater_entrance',
  //song warps
  0x0600: 'region.sacred_forest_meadow -> region.minuet_of_forest_warp',
  0x04F6: 'region.dmc_central_local -> region.bolero_of_fire_warp',
  0x0604: 'region.lake_hylia -> region.serenade_of_water_warp',
  0x01F1: 'region.desert_colossus -> region.requiem_of_spirit_warp',
  0x0568: 'region.graveyard_warp_pad_region -> region.nocturne_of_shadow_warp',
  0x05F4: 'region.temple_of_time -> region.prelude_of_light_warp',
  //owl warps
  0x027E: 'region.hyrule_field -> region.lh_owl_flight',
  0x0554: 'region.kak_impas_rooftop -> region.dmt_owl_flight',
  // link's house
  0x00BB: 'region.kf_links_house -> region.child_spawn',
};
var EntranceIndexToSceneExit = {
  //kokiri
  0x0209: 'exit/deku',
  0x020D: 'exit/kokiri_forest.kokiri_bridge_gateway',
  0x0211: 'subexit/kokiri.links_house',
  0x0266: 'subexit/kokiri.shop',
  0x026A: 'subexit/kokiri.know_it_house',
  0x0286: 'exit/kokiri_forest.kokiri_woods_gateway',
  0x033C: 'subexit/kokiri.twins_house',
  0x0443: 'subexit/kokiri.midos_house',
  0x0447: 'subexit/kokiri.sarias_house',
  //woods
  0x011E: 'exit/lost_woods.kokiri_woods_gateway',
  0x01A9: 'exit/lw_beyond_mido.meadow_woods_gateway',
  0x04D6: 'exit/lost_woods.gc_woods_gateway',
  0x04DA: 'exit/lost_woods.river_woods_gateway',
  0x04DE: 'exit/lw_bridge.field_woods_gateway',
  0x05E0: 'exit/lw_bridge.kokiri_bridge_gateway',
  //meadow
  0x00FC: 'exit/sfm_entryway.meadow_woods_gateway',
  0x0215: 'exit/temple_forest',
  //river
  0x00EA: 'exit/zr_front.river_field_gateway',
  0x019D: 'exit/zr_behind_waterfall.river_domain_gateway',
  0x01DD: 'exit/zora_river.river_woods_gateway',
  //zoras
  0x0108: 'exit/zoras_domain.river_domain_gateway',
  0x01A1: 'exit/zd_behind_king_zora.fountain_domain_gateway',
  0x03C4: 'subexit/zoras.shop',
  0x0328: 'exit/zoras_domain.domain_lake_gateway',
  //fountain
  0x0221: 'exit/jabujabu',
  0x0225: 'exit/zoras_fountain.fountain_domain_gateway',
  0x03D4: 'exit/ice_cavern',
  0x0394: 'subexit/fountain.fairy_fountain',
  //kakariko
  0x00DB: 'exit/kakariko_village.kakariko_field_gateway',
  0x0191: 'exit/kak_behind_gate.mountain_kakariko_gateway',
  0x0195: 'exit/kakariko_village.graveyard_kakariko_gateway',
  0x0201: 'subexit/kakariko.shop_bazaar',
  0x02A6: 'exit/well',
  0x0345: 'subexit/kakariko.impas_house',
  0x0349: 'subexit/kakariko.carpenter_house',
  0x034D: 'subexit/kakariko.kakariko_witch',
  0x0351: 'subexit/kakariko.windmill',
  0x044B: 'subexit/kakariko.shop_magic',
  0x0463: 'subexit/kakariko.minigame_shooting',
  0x04EE: 'subexit/kakariko.skulltula_house',
  0x04FF: 'subexit/kakariko.shop_magic_back',
  0x05DC: 'subexit/kakariko.impa_back',
  //graveyard
  0x00E4: 'exit/graveyard.graveyard_kakariko_gateway',
  0x0205: 'exit/temple_shadow',
  0x0355: 'subexit/graveyard.dampes_hut',
  0x0359: 'subexit/graveyard.dampes_grave',
  0x035D: 'subexit/graveyard.shield_grave',
  0x0361: 'subexit/graveyard.redead_grave',
  0x050B: 'subexit/graveyard.royal_grave',
  //mountain
  0x013D: 'exit/death_mountain.mountain_kakariko_gateway',
  0x01B9: 'exit/death_mountain.mountain_goron_gateway',
  0x01BD: 'exit/death_mountain_summit.crater_mountain_gateway',
  0x0242: 'exit/dodongo',
  0x045B: 'subexit/mountain.fairy_fountain',
  //goron
  0x014D: 'exit/goron_city.mountain_goron_gateway',
  0x01C1: 'exit/gc_darunias_chamber.crater_goron_gateway',
  0x03FC: 'subexit/goron.shop',
  0x04E2: 'exit/gc_woods_warp.gc_woods_gateway',
  //crater
  0x0147: 'exit/dmc_upper_local.crater_mountain_gateway',
  0x0246: 'exit/dmc_lower_local.crater_goron_gateway',
  0x024A: 'exit/temple_fire',
  0x0482: 'subexit/crater.fairy_fountain',
  //town_entrance
  0x0033: 'exit/market_entrance.marketentrance_market_gateway',
  0x0276: 'exit/market_entrance.marketentrance_field_gateway',
  0x026E: 'subexit/castle_town.guard_tower',
  //market
  0x00B1: 'exit/market.marketentrance_market_gateway',
  0x025A: 'exit/market.grounds_market_gateway',
  0x025E: 'exit/market.tot_market_gateway',
  0x02A2: 'subexit/castle_town.shop_magic',
  0x03B8: 'subexit/castle_town.shop_bazaar',
  0x03BC: 'subexit/castle_town.minigame_bombchu',
  0x01CD: 'subexit/castle_town.minigame_shooting',
  0x01D1: 'subexit/castle_town.shop_mask',
  0x01D5: 'subexit/castle_town.minigame_treasure',
  0x03C0: 'subexit/castle_town.shop_bombchu',
  0x0067: 'subexit/castle_town.back_house',
  //temple_time
  0x0171: 'exit/tot_entrance.tot_market_gateway',
  0x0472: 'subexit/castle_town.temple_of_time',
  //castle
  0x0138: 'exit/castle_grounds.grounds_market_gateway',
  0x0340: 'subexit/castle.fairy_young',
  //castle_ganon
  0x0138: 'exit/castle_grounds.grounds_market_gateway',
  0x0340: 'subexit/castle.fairy_adult',
  //hyrule_field
  0x017D: 'exit/hyrule_field.kakariko_field_gateway',
  0x0181: 'exit/hyrule_field.river_field_gateway',
  0x0185: 'exit/hyrule_field.field_woods_gateway',
  0x0189: 'exit/hyrule_field.lake_field_gateway',
  0x018D: 'exit/hyrule_field.valley_field_gateway',
  0x01F9: 'exit/hyrule_field.ranch_field_gateway',
  0x01FD: 'exit/hyrule_field.marketentrance_field_gateway',
  //lonlon
  0x0157: 'exit/lon_lon_ranch.ranch_field_gateway',
  0x0378: 'subexit/lonlon.house',
  0x042F: 'subexit/lonlon.stables',
  0x05D4: 'subexit/lonlon.silo',
  //lake
  0x0102: 'exit/lake_hylia.lake_field_gateway',
  0x021D: 'exit/temple_water',
  0x03CC: 'subexit/lake.laboratory',
  0x0309: 'subexit/lake.fishing',
  0x0560: 'exit/lake_hylia.domain_lake_gateway',
  //gerudo_valley
  0x0117: 'exit/gerudo_valley.valley_field_gateway',
  0x022D: 'exit/gv_fortress_side.valley_fortress_gateway',
  0x03D0: 'subexit/gerudo_valley.tend',
  //gerudo_fortress
  0x0129: 'exit/gerudo_fortress.valley_fortress_gateway',
  0x03A8: 'exit/training_grounds',
  0x03AC: 'exit/gf_outside_gate.wasteland_fortress_gateway',
  //desert
  0x0130: 'exit/wasteland_near_fortress.wasteland_fortress_gateway',
  0x0365: 'exit/wasteland_near_colossus.wasteland_colossus_gateway',
  //colossus
  0x0123: 'exit/desert_colossus.wasteland_colossus_gateway',
  0x01E1: 'exit/temple_spirit',
  0x057C: 'subexit/desert.fairy_fountain',
};

function specialEntrances(location, exit, value) {
  if (value == undefined) return;
  if (!locations[location][exit] || locations[location][exit].value != value) {
    locations[location][exit] = {
      visited: true,
      value: value
    };
    for (var i = 0; i < clients.length; i++) {
      clients[i].send('5 '+location+' '+exit+' '+value);
    }
    changed = true;
  }
}

function checkLocations() {
  // 80402D70 - grotto list
  // 80402E36 - current grotto id - 0xFF no grotto
  // 801CA10C - grotto actor category
  //    +0x00 u16 - actor id, needs to be grotto 0x009B
  //    +0x08 u32 - pos.x
  //    +0x0C u32 - pos.y
  //    +0x10 u32 - pos.z
  //    +0x19 u8  - grotto id
  //    +0x1C u8  - grotto type, left number needs to be 2+
  //    +0x124    - pointer to next actor
  //
  // 801DA2A4 - pointer to current scene's exit list, u16 = entrance index, if >= 0x1000 then grotto entrance
  // 8011A5D2 - last entrance index
  // 800F9C90 - entrance list, u8 = scene
  // 801C8544 - current scene, u16
  // 800903D2 - adult spawn entrance index, u16
  // 800903E2 - child spawn entrance index, u16
  // 803AB22C - song warps, u16 6 entries
  // 80053F92 - crater owl entrance index, u16
  // 80053FC6 - lake owl entrance index, u16
  if (currentMode == 3) {
    if (!locations['overworld']) locations['overworld'] = {};
    if (!locations['area/mountain']) locations['area/mountain'] = {};
    if (!locations['area/lake']) locations['area/lake'] = {};
    specialEntrances('overworld', 'exit/child.spawn', EntranceIndexToTrackerEntrance[mem.u16[0x800903E2]]);
    specialEntrances('area/mountain', 'exit/dmt.owl_flight', EntranceIndexToTrackerEntrance[mem.u16[0x80053F92]]);
    specialEntrances('area/lake', 'exit/lh.owl_flight', EntranceIndexToTrackerEntrance[mem.u16[0x80053FC6]]);
    specialEntrances('overworld', 'exit/adult.spawn', EntranceIndexToTrackerEntrance[mem.u16[0x800903D2]]);
    var songs = 0x803AB22C;
    if (
         mem.u16[songs]
      || mem.u16[songs + 2]
      || mem.u16[songs + 4]
      || mem.u16[songs + 6]
      || mem.u16[songs + 8]
      || mem.u16[songs + 10]
    ) {
      specialEntrances('overworld', 'exit/minuet', EntranceIndexToTrackerEntrance[mem.u16[songs]]);
      specialEntrances('overworld', 'exit/bolero', EntranceIndexToTrackerEntrance[mem.u16[songs + 2]]);
      specialEntrances('overworld', 'exit/serenade', EntranceIndexToTrackerEntrance[mem.u16[songs + 4]]);
      specialEntrances('overworld', 'exit/requiem', EntranceIndexToTrackerEntrance[mem.u16[songs + 6]]);
      specialEntrances('overworld', 'exit/nocturne', EntranceIndexToTrackerEntrance[mem.u16[songs + 8]]);
      specialEntrances('overworld', 'exit/prelude', EntranceIndexToTrackerEntrance[mem.u16[songs + 10]]);
    }
  }
  var scene = mem.u16[0x801C8544];
  var sceneName = '';
  var sceneExits = [];
  var sceneGrottos = {};
  var tmpLocation = null;
  if (scene == 0x0000) tmpLocation = 'area/deku';
  else if (scene == 0x0001) tmpLocation = 'area/dodongo';
  else if (scene == 0x0002) tmpLocation = 'area/jabujabu';
  else if (scene == 0x0003) tmpLocation = 'area/temple_forest';
  else if (scene == 0x0004) tmpLocation = 'area/temple_fire';
  else if (scene == 0x0005) tmpLocation = 'area/temple_water';
  else if (scene == 0x0007) tmpLocation = 'area/temple_shadow';
  else if (scene == 0x0006) tmpLocation = 'area/temple_spirit';
  else if (scene == 0x0008) tmpLocation = 'area/well';
  else if (scene == 0x0009) tmpLocation = 'area/ice_cavern';
  else if (scene == 0x000B) tmpLocation = 'area/training_grounds';
  else if (scene == 0x000D) tmpLocation = 'area/castle_ganon';
  if (tmpLocation && location != tmpLocation) {
    location = tmpLocation;
    if (prevDungeonTypes[location] && !prevDungeonTypes[location].visited) {
      prevDungeonTypes[location].visited = true;
      for (var i = 0; i < clients.length; i++) {
        clients[i].send('4 '+location+' '+prevDungeonTypes[location].type);
      }
      changed = true;
    }
    for (var i = 0; i < clients.length; i++) {
      clients[i].send('6 '+location);
    }
  }
  if (scene == 0x0055) {
    sceneName = 'area/kokiri';
    sceneExits = [
      null,
      'exit/deku',
      'exit/kokiri_forest.kokiri_bridge_gateway',
      'subexit/kokiri.links_house',
      'subexit/kokiri.shop',
      'subexit/kokiri.know_it_house',
      'exit/kokiri_forest.kokiri_woods_gateway',
      null,
      'subexit/kokiri.twins_house',
      'subexit/kokiri.midos_house',
      'subexit/kokiri.sarias_house'
    ];
    sceneGrottos['C400000043BE0000C4990000'] = 'subexit/kokiri.storm_grotto';
  }
  else if (scene == 0x005B) {
    sceneName = 'area/woods';
    sceneExits = [
      'exit/lost_woods.kokiri_woods_gateway',
      'exit/lw_beyond_mido.meadow_woods_gateway',
      null,
      null,
      null,
      null,
      'exit/lost_woods.gc_woods_gateway',
      'exit/lost_woods.river_woods_gateway',
      'exit/lw_bridge.field_woods_gateway',
      'exit/lw_bridge.kokiri_bridge_gateway',
    ];
    sceneGrottos['4464C00000000000C4674000'] = 'subexit/woods.near_goron_grotto';
    sceneGrottos['42A00000C1A00000C4C80000'] = 'subexit/woods.theatre_grotto';
    sceneGrottos['4427800000000000C51D8000'] = 'subexit/woods.near_meadow_grotto';
  }
  else if (scene == 0x0056) {
    sceneName = 'area/meadow';
    sceneExits = [
      'exit/sfm_entryway.meadow_woods_gateway',
      'exit/temple_forest',
    ];
    sceneGrottos['C34300000000000044ED8000'] = 'subexit/meadow.wolfos_grotto';
    sceneGrottos['4234000000000000435C0000'] = 'subexit/meadow.fairy_grotto';
    sceneGrottos['439B000043F00000C50FC000'] = 'subexit/meadow.storms_grotto';
  }
  else if (scene == 0x0054) {
    sceneName = 'area/river';
    sceneExits = [
      'exit/zr_front.river_field_gateway',
      null,
      'exit/zr_behind_waterfall.river_domain_gateway',
      null,
      'exit/zora_river.river_woods_gateway'
    ];
    sceneGrottos['44278000440E8000C3B68000'] = 'subexit/river.bomb_grotto';
    sceneGrottos['C4CBC00042C80000C3020000'] = 'subexit/river.storms_grotto';
    sceneGrottos['43B40000440E800043020000'] = 'subexit/river.open_grotto';
  }
  else if (scene == 0x0058) {
    sceneName = 'area/zoras';
    sceneExits = [
      'exit/zoras_domain.river_domain_gateway',
      'exit/zd_behind_king_zora.fountain_domain_gateway',
      'subexit/zoras.shop',
      'exit/zoras_domain.domain_lake_gateway',
    ];
    sceneGrottos['C457000041600000C3EB0000'] = 'subexit/zoras.storms_grotto';
  }
  else if (scene == 0x0059) {
    sceneName = 'area/fountain';
    sceneExits = [
      null,
      'exit/jabujabu',
      'exit/zoras_fountain.fountain_domain_gateway',
      'exit/ice_cavern',
      'subexit/fountain.fairy_fountain',
    ];
  }
  else if (scene == 0x0052) {
    sceneName = 'area/kakariko';
    sceneExits = [
      'exit/kakariko_village.kakariko_field_gateway',
      'exit/kak_behind_gate.mountain_kakariko_gateway',
      'exit/kakariko_village.graveyard_kakariko_gateway',
      'subexit/kakariko.shop_bazaar',
      'exit/well',
      'subexit/kakariko.impas_house',
      'subexit/kakariko.carpenter_house',
      'subexit/kakariko.kakariko_witch',
      'subexit/kakariko.windmill',
      'subexit/kakariko.shop_magic',
      'subexit/kakariko.minigame_shooting',
      'subexit/kakariko.skulltula_house',
      'subexit/kakariko.shop_magic_back',
      'subexit/kakariko.impa_back',
    ];
    sceneGrottos['C3C800000000000043C80000'] = 'subexit/kakariko.redead_grotto';
    sceneGrottos['4457000042A00000C3820000'] = 'subexit/kakariko.open_grotto';
  }
  else if (scene == 0x0053) {
    sceneName = 'area/graveyard';
    sceneExits = [
      'exit/graveyard.graveyard_kakariko_gateway',
      'exit/temple_shadow',
      'subexit/graveyard.dampes_hut',
      'subexit/graveyard.dampes_grave',
      'subexit/graveyard.shield_grave',
      'subexit/graveyard.redead_grave',
      'subexit/graveyard.royal_grave',
    ];
  }
  else if (scene == 0x0060) {
    sceneName = 'area/mountain';
    sceneExits = [
      'exit/death_mountain.mountain_kakariko_gateway',
      'exit/death_mountain.mountain_goron_gateway',
      'exit/death_mountain_summit.crater_mountain_gateway',
      'exit/dodongo',
      'subexit/mountain.fairy_fountain',
    ];
    sceneGrottos['C3BF800044AD4000C496C000'] = 'subexit/mountain.storms_grotto';
    sceneGrottos['C42C000044F34000C38E8000'] = 'subexit/mountain.bomb_grotto';
  }
  else if (scene == 0x0062) {
    sceneName = 'area/goron';
    sceneExits = [
      'exit/goron_city.mountain_goron_gateway',
      'exit/gc_darunias_chamber.crater_goron_gateway',
      'subexit/goron.shop',
      'exit/gc_woods_warp.gc_woods_gateway',
    ];
    sceneGrottos['4489800044110000C494C000'] = 'subexit/goron.grotto';
  }
  else if (scene == 0x0061) {
    sceneName = 'area/crater';
    sceneExits = [
      'exit/dmc_upper_local.crater_mountain_gateway',
      'exit/dmc_lower_local.crater_goron_gateway',
      'exit/temple_fire',
      'subexit/crater.fairy_fountain',
    ];
    sceneGrottos['C4D4600044348000C3EC0000'] = 'subexit/crater.hammer_grotto';
    sceneGrottos['42200000449A200044DD4000'] = 'subexit/crater.bomb_grotto';
  }
  else if (scene == 0x001B || scene == 0x001C || scene == 0x1D) {
    sceneName = 'area/town_entrance';
    sceneExits = [
      'exit/market_entrance.marketentrance_market_gateway',
      'exit/market_entrance.marketentrance_field_gateway',
      'subexit/castle_town.guard_tower',
    ];
  }
  else if (scene == 0x0020 || scene == 0x0021 || scene == 0x22) {
    sceneName = 'area/castle_town';
    sceneExits = [
      'exit/market.marketentrance_market_gateway',
      'exit/market.grounds_market_gateway',
      'exit/market.tot_market_gateway',
      null,
      null,
      'subexit/castle_town.shop_magic',
      'subexit/castle_town.shop_bazaar',
      'subexit/castle_town.minigame_bombchu',
      'subexit/castle_town.minigame_shooting',
      'subexit/castle_town.shop_mask',
      'subexit/castle_town.minigame_treasure',
    ];
  }
  else if (scene == 0x001E) {
    sceneName = 'area/castle_town';
    sceneExits = [
      null,
      null,
      'subexit/castle_town.shop_bombchu',
      'subexit/castle_town.back_house',
    ];
  }
  else if (scene == 0x0023 || scene == 0x0024 || scene == 0x25) {
    sceneName = 'area/temple_time';
    sceneExits = [
      'exit/tot_entrance.tot_market_gateway',
      'subexit/castle_town.temple_of_time',
    ];
  }
  else if (scene == 0x005F) {
    sceneName = 'area/castle';
    sceneExits = [
      'exit/castle_grounds.grounds_market_gateway',
      null,
      'subexit/castle.fairy_young',
    ];
    sceneGrottos['4479000044C4600044530000'] = 'subexit/castle.storm_grotto';
  }
  else if (scene == 0x0064) {
    sceneName = 'area/castle_ganon_outside';
    sceneExits = [
      'exit/castle_grounds.grounds_market_gateway',
      null,
      'subexit/castle.fairy_adult',
    ];
  }
  else if (scene == 0x0051) {
    sceneName = 'area/hyrule_field';
    sceneExits = [
      null,
      'exit/hyrule_field.kakariko_field_gateway',
      'exit/hyrule_field.river_field_gateway',
      'exit/hyrule_field.field_woods_gateway',
      'exit/hyrule_field.lake_field_gateway',
      'exit/hyrule_field.valley_field_gateway',
      'exit/hyrule_field.ranch_field_gateway',
      'exit/hyrule_field.marketentrance_field_gateway',
    ];
    sceneGrottos['C58B1000C3960000C3D48000'] = 'subexit/hyrule_field.fairy_grotto';
    sceneGrottos['C59BF000C42F00004657F000'] = 'subexit/hyrule_field.lake_fence_grotto';
    sceneGrottos['4500C00041A00000C32A0000'] = 'subexit/hyrule_field.kakariko_grotto';
    sceneGrottos['C5F5F000C396000045D84000'] = 'subexit/hyrule_field.valley_grotto';
    sceneGrottos['C59A8800C396000045313000'] = 'subexit/hyrule_field.dive_grotto';
    sceneGrottos['C3870000C3FA00004640F800'] = 'subexit/hyrule_field.little_forest_grotto';
    sceneGrottos['C57BE000C42F000046589000'] = 'subexit/hyrule_field.lake_open_grotto';
    sceneGrottos['C4B2200000000000444A8000'] = 'subexit/hyrule_field.castle_entrance_grotto';
  }
  else if (scene == 0x0063) {
    sceneName = 'area/lonlon';
    sceneExits = [
      'exit/lon_lon_ranch.ranch_field_gateway',
      null,
      null,
      null,
      'subexit/lonlon.house',
      'subexit/lonlon.stables',
      'subexit/lonlon.silo',
    ];
    sceneGrottos['44E100000000000044BB8000'] = 'subexit/lonlon.open_grotto';
  }
  else if (scene == 0x0057) {
    sceneName = 'area/lake';
    sceneExits = [
      'exit/lake_hylia.lake_field_gateway',
      null,
      'exit/temple_water',
      null,
      'subexit/lake.laboratory',
      'subexit/lake.fishing',
      'exit/lake_hylia.domain_lake_gateway',
    ];
    sceneGrottos['C53E0000C481200045BDD800'] = 'subexit/lake.grave_grotto';
  }
  else if (scene == 0x005A) {
    sceneName = 'area/gerudo_valley';
    sceneExits = [
      'exit/gerudo_valley.valley_field_gateway',
      null,
      null,
      'exit/gv_fortress_side.valley_fortress_gateway',
      'subexit/gerudo_valley.tend',
    ];
    sceneGrottos['C4A5600041700000C4724000'] = 'subexit/gerudo_valley.storms_grotto';
    sceneGrottos['438C0000C40AC00044B7C000'] = 'subexit/gerudo_valley.octorock_grotto';
  }
  else if (scene == 0x005D) {
    sceneName = 'area/gerudo';
    sceneExits = [
      'exit/gerudo_fortress.valley_fortress_gateway',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      'exit/training_grounds',
      'exit/gf_outside_gate.wasteland_fortress_gateway',
    ];
    sceneGrottos['43BC000043A68000C4C38000'] = 'subexit/gerudo.storms_grotto';
  }
  else if (scene == 0x005E) {
    sceneName = 'area/desert';
    sceneExits = [
      'exit/wasteland_near_fortress.wasteland_fortress_gateway',
      'exit/wasteland_near_colossus.wasteland_colossus_gateway',
    ];
  }
  else if (scene == 0x005C) {
    sceneName = 'area/colossus';
    sceneExits = [
      'exit/desert_colossus.wasteland_colossus_gateway',
      'exit/temple_spirit',
      null,
      null,
      'subexit/desert.fairy_fountain',
    ];
    sceneGrottos['42700000C2000000C4A28000'] = 'subexit/desert.strength_grotto';
  }
  else {
    var lastExit = mem.u16[0x8011A5D2];
    var grottoId = mem.u8[0x80402E36];
    if (grottoId != 0xFF) lastExit = grottoId | 0x1000;
    var region = EntranceIndexToTrackerEntrance[lastExit];
    if (region == undefined) return;
    for (var name in locations) {
      for (var exit in locations[name]) {
        var entry = locations[name][exit];
        if (region && entry.value == region) {
          if (!entry.visited) {
            entry.visited = true;
            for (var i = 0; i < clients.length; i++) {
              clients[i].send('5 '+name+' '+exit+' '+entry.value);
            }
            changed = true;
          }
          return;
        }
      }
    }
    return;
  }
  if (location != sceneName) {
    location = sceneName;
    for (var i = 0; i < clients.length; i++) {
      clients[i].send('6 '+location);
    }
  }
  if (!locations['overworld']) locations['overworld'] = {};
  if (!locations[sceneName]) locations[sceneName] = {};
  var index = 0;
  var exits = mem.u32[0x801DA2A4];
  for (var exit in sceneExits) {
    exit = sceneExits[exit];
    if (exit) {
      var name = sceneName;
      if (
        exit == 'exit/deku'
        || exit == 'exit/dodongo'
        || exit == 'exit/jabujabu'
        || exit == 'exit/temple_forest'
        || exit == 'exit/temple_fire'
        || exit == 'exit/temple_water'
        || exit == 'exit/temple_shadow'
        || exit == 'exit/temple_spirit'
        || exit == 'exit/well'
        || exit == 'exit/ice_cavern'
        || exit == 'exit/training_grounds'
      ) name = 'overworld';
      if (!locations[name][exit]) locations[name][exit] = {visited:false};
      var region = EntranceIndexToTrackerEntrance[mem.u16[exits + index]];
      if (region != undefined) {
        locations[name][exit].value = region;
        if (!locations[name][exit].visited && exit == EntranceIndexToSceneExit[mem.u16[0x8011A5D2]]) {
          locations[name][exit].visited = true;
          for (var i = 0; i < clients.length; i++) {
            clients[i].send('5 '+name+' '+exit+' '+locations[name][exit].value);
          }
          changed = true;
        }
      }
    }
    index += 2;
  }
  var actor = mem.u32[0x801CA10C];
  // 801CA10C - grotto actor category
  //    +0x00 u16 - actor id, needs to be grotto 0x009B
  //    +0x08 u32 - pos.x
  //    +0x0C u32 - pos.y
  //    +0x10 u32 - pos.z
  //    +0x19 u8  - grotto id
  //    +0x1C u8  - grotto type, left number needs to be 2+
  //    +0x124    - pointer to next actor
  while (actor) {
    if (mem.u16[actor] == 0x009B) {
      var id = mem.u32[actor + 0x08].hex()
              +mem.u32[actor + 0x0C].hex()
              +mem.u32[actor + 0x10].hex();
      var grottoId = mem.u16[actor + 0x18];
      var grottoType = mem.u8[actor + 0x1C] >> 4;
      if (sceneGrottos[id] && grottoType >= 2) {
        var name = sceneName;
        var exit = sceneGrottos[id];
        if (!locations[name][exit]) locations[name][exit] = {visited:false};
        var region = EntranceIndexToTrackerEntrance[grottoId];
        if (region != undefined) locations[name][exit].value = region;
      }
    }
    actor = mem.u32[actor + 0x124];
  }
}

// if (getCurrentMode() >= 3) {
//   checkFlags();
//   checkDungeons();
//   checkItems();
//   checkShops();
// }
setInterval(function() {
  currentMode = getCurrentMode();
  if (currentMode < 3) {
    saveState();
    saveFile = null;
    return;
  }
  if (saveFile == null) loadState();
  findItemLocationsCache = null;
  findDungeonTypeAddrCache = null;
  checkFlags();
  checkDungeons();
  checkItems();
  checkShops();
  checkLocations();
}, 1000);

function sendAllData(ws) {
  ws.send('-1');
  for (var item in prevItems) {
    ws.send('0 '+item+' '+prevItems[item]);
  }
  for (var dungeon in prevDungeonTypes) {
    if (prevDungeonTypes[dungeon].visited) ws.send('4 '+dungeon+' '+prevDungeonTypes[dungeon].type);
  }
  for (var flagLocation in prevFlags) {
    for (var flag in prevFlags[flagLocation]) {
      ws.send('1 '+flagLocation+' '+flag+' '+prevFlags[flagLocation][flag]);
    }
  }
  for (var item in prevDungeons) {
    ws.send('2 '+item+' '+prevDungeons[item]);
  }
  for (var item in shops) {
    ws.send('3 '+item+' '+shops[item].item+' '+shops[item].price+' '+shops[item].bought+' '+shops[item].player);
  }
  for (var name in locations) {
    for (var exit in locations[name]) {
      var entry = locations[name][exit];
      if (entry.visited) ws.send('5 '+name+' '+exit+' '+entry.value);
    }
  }
  ws.send('6 '+location);
  ws.send('-2');
}

console.clear();
console.log('Please enter the port for the tracker to listen on.');
console.log('Use the same port number every time or else\n the tracker won\'t remember anything.');
console.log('Port 8080 is a good number.');
console.listen(function(input) {
  var port = parseInt(input);
  if (port < 1000) {
    console.log('Please use a port number over 1000.');
    return;
  }
  console.listen(null);
  console.log('Starting webserver on port '+port+'...');
  console.log('Connect using http://127.0.0.1:'+port+'/');
  var httpd = require('httpd.js').listen(port, pj64.scriptsDirectory+'modules/Tracker/track-oot/', pj64.scriptsDirectory+'modules/Tracker/index.html', function(ws) {
    if (ws.uri) {
      clients.push(ws);
      ws.accept();
      ws.onData(function(data) {
        if (data == '0') {
          sendAllData(ws);
        }
      });
      ws.socket.on('close', function() {
        const index = clients.indexOf(ws);
        if (index > -1) {
          clients.splice(index, 1);
        }
      });
    }
    else ws.decline();
  });
  // console.listen(function(input) {
  //   var tmp = '00000000'+parseInt(input, 16).toString(2);
  //   console.log(tmp.substr(tmp.length-8));
  //   console.log('87654321');
  // });
});
