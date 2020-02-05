import React, {Component} from 'react';
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
export default class App extends Component {
  state = {
    isEdit: null,
    list: [],
    isLoading: false,
    editText: '',
  };
  componentDidMount = () => {
    this.setState({isLoading: true});
    // AsyncStorage.removeItem('list')
    AsyncStorage.getItem('list')
      .then(list => {
        if (list) {
          this.setState({list: JSON.parse(list), isLoading: false});
        } else {
          this.setState({list: [], isLoading: false});
        }
      })
      .catch(err => {
        this.setState({isLoading: false});
      });
  };
  add = () => {
    let list = this.state.list;
    list.push('');
    this.setState({list: list});
    this.saveToStorage();
    
    this.setEdit(list.length-1);
  };
  setEdit = index => {
    if (this.state.isEdit !== index) {
      this.setState({isEdit: index, editText: this.state.list[index]});
    }
  };
  setList = (text, index) => {
    let list = this.state.list;
    list[index] = text;
    this.setState({list: list, isEdit: null, editText: ''});

    this.saveToStorage();
  };
  saveToStorage = () => {
    let data = JSON.stringify(this.state.list);
    AsyncStorage.setItem('list', data);
  };
  deleteItem = index => {
    let list = this.state.list;
    list.splice(index, 1);
    this.setState({list: list});
    this.saveToStorage();
  };
  render() {
    return (
      <ScrollView style={style.container}>
        <View style={style.header}>
          <Text style={style.headerText}>Note App</Text>
        </View>
        {this.state.isLoading ? (
          <ActivityIndicator color="#d28888" size="large" />
        ) : (
          <View style={style.body}>
            {this.state.list.map((item, key) => (
              <React.Fragment>
                {this.state.isEdit === null || this.state.isEdit !== key ? (
                  <TouchableOpacity
                    style={style.item}
                    activeOpacity={0.5}
                    onLongPress={() => this.setEdit(key)}>
                    <Text style={style.itemText}>{item}</Text>
                    <TouchableOpacity
                      style={style.itemDelete}
                      onPress={() => this.deleteItem(key)}>
                      <Text style={style.itemDeleteText}>Delete</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ) : null}
                {this.state.isEdit !== null ? (
                  key == this.state.isEdit ? (
                    <TextInput
                      style={style.itemInput}
                      onBlur={() => this.setList(this.state.editText, key)}
                      onSubmitEditing={() =>
                        this.setList(this.state.editText, key)
                      }
                      value={this.state.editText}
                      autoFocus
                      onChangeText={editText => this.setState({editText})}
                    />
                  ) : null
                ) : null}
              </React.Fragment>
            ))}
            <TouchableOpacity style={style.btnAdd} onPress={() => this.add()}>
              <Text style={style.btnAddText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  container: {backgroundColor: '#f2f2f2', height: '100%'},
  header: {
    backgroundColor: '#d2d2d2',
    elevation: 5,
    paddingHorizontal: '5%',
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 20,
  },
  btnAdd: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  btnAddText: {
    fontSize: 25,
    fontWeight: '700',
  },
  body: {paddingHorizontal: '4%', paddingVertical: 15},
  item: {
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    minHeight: 50,
    position: 'relative',
  },
  itemDelete: {
    position: 'absolute',
    fontSize: 16,
    padding: 10,
    right: 0,
  },
  itemDeleteText: {
    fontSize: 16,
  },
  itemText: {
    fontSize: 16,
    paddingHorizontal: '1%',
  },
  itemInput: {
    borderBottomWidth: 1,
    fontSize: 16,
  },
});
